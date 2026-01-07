import Ajv from "ajv";
import addFormats from "ajv-formats";

describe('Dog API - Imagem Aleatória (Random image)', () => {
  const url = 'https://dog.ceo/api/breeds/image/random';
  const ajv = new Ajv();
  addFormats(ajv);

  context('Teste De Contrato', () => {
    it('Deve validar o contrato do endpoint de imagem aleatória', () => {
      cy.fixture('breed_images_random_schema').then((schema) => {
        cy.request(url).then((response) => {
          // Validação estrutural do JSON utilizando JSON Schema (AJV)
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
    it('Deve retornar uma imagem aleatória', () => {
      cy.request(url).then((response) => {
        // Validação básica de status code e integridade do atributo status
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq('success');

        const imageUrl = response.body.message;

        // Validação de formato: URL deve conter domínio oficial e extensão de imagem válida
        expect(imageUrl).to.be.a('string');
        expect(imageUrl).to.match(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/i);

        // Sanity Check: Garante que a URL de imagem retornada está acessível (Broken Link Check)
        cy.request(imageUrl).its('status').should('eq', 200);
      });
    });

    it('Deve garantir a variabilidade (dois requests seguidos devem ser diferentes)', () => {
      cy.request(url).then((res1) => {
        const img1 = res1.body.message;

        cy.request(url).then((res2) => {
          const img2 = res2.body.message;

          // Validação de Idempotência: Garante que o sorteio aleatório está funcional
          expect(img1, 'A imagem aleatória deve mudar entre as requisições').to.not.equal(img2);
        });
      });
    });

    it('Deve retornar erro 405 ao tentar um método não permitido', () => {
      cy.request({
        method: 'POST',
        url: url,
        failOnStatusCode: false
      }).then((response) => {
        // Validação de conformidade com o protocolo HTTP (Método não permitido)
        expect(response.status).to.eq(405);
      });
    });
  });
});