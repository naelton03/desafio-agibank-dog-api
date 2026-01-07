import Ajv from "ajv";

describe('Dog API - Listagem Completa de Raças', () => {
  const url = 'https://dog.ceo/api/breeds/list/all';
  const ajv = new Ajv();

  beforeEach(() => {
    // Alias para otimizar o reuso da requisição principal nos testes funcionais
    cy.request(url).as('getBreeds');
  });

  context('Teste De Contrato', () => {
    it('Deve validar o contrato do endpoint de listagem de raças', () => {
      cy.fixture('breed_schema').then((schema) => {
        cy.request('GET', url).then((response) => {
          // Validação de contrato via JSON Schema (AJV) para garantir a tipagem do objeto 'message'
          const validate = ajv.compile(schema);
          const valid = validate(response.body);

          if (!valid) {
            cy.log('Erros no Contrato:', validate.errors);
          }

          expect(valid, 'O JSON retornado deve seguir o Schema definido').to.be.true;
        });
      });
    });
  });

  context('Testes Funcionais', () => {
    it('Deve garantir que as raças estão listadas em ordem alfabética', () => {
      cy.get('@getBreeds').then((response) => {
        // Validação de regra de negócio: As chaves do objeto devem seguir ordenação alfabética (A-Z)
        const breeds = Object.keys(response.body.message);
        const sortedBreeds = [...breeds].sort();
        expect(breeds).to.deep.equal(sortedBreeds);
      });
    });

    it('Deve validar a presença de raças populares e suas sub-raças', () => {
      cy.get('@getBreeds').then((response) => {
        const message = response.body.message;

        // Smoke Test: Verifica a existência de propriedades críticas e a integridade de arrays de sub-raças
        expect(message).to.have.property('labrador');
        expect(message).to.have.property('poodle');

        // Validação de conteúdo: Garante que membros específicos de sub-categorias estão presentes
        expect(message.bulldog).to.include.members(['boston', 'english', 'french']);
      });
    });

    it('Deve retornar erro 405 ao tentar um método não permitido', () => {
      cy.request({
        method: 'POST',
        url: url,
        failOnStatusCode: false
      }).then((response) => {
        // Teste de resiliência e conformidade com o protocolo HTTP para métodos não suportados
        expect(response.status).to.eq(405);
      });
    });
  });
});