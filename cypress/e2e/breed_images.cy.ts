import Ajv from "ajv";
import addFormats from "ajv-formats";

describe('Dog API - Imagens por Raça', () => {
    const url = 'https://dog.ceo/api/breed';
    const breed = 'hound'; 
    const ajv = new Ajv();
    addFormats(ajv);

    context('Teste De Contrato', () => {
        it('Deve validar o contrato do endpoint de imagens por raça', () => {
            cy.fixture('breed_images_schema').then((schema) => {
                cy.request(`${url}/${breed}/images`).then((response) => {
                    // Validação de contrato via JSON Schema (AJV) para garantir integridade da estrutura
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
        it('Deve retornar uma lista de imagens para uma raça válida', () => {
            cy.request(`${url}/${breed}/images`).then((response) => {
                // Validações básicas de status code e tipo primitivo do payload
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq('success');
                expect(response.body.message).to.be.an('array');

                // Validação de conformidade: garante que os links seguem o padrão de diretórios da raça e extensões válidas
                response.body.message.forEach((imageUrl: string) => {
                    expect(imageUrl).to.contain(`breeds/${breed}`);
                    expect(imageUrl).to.match(/\.(jpg|jpeg|png)$/i); 
                });

                // Sanity Check: Verifica se o primeiro recurso da lista está acessível (integridade de mídia)
                cy.request(response.body.message[0]).its('status').should('eq', 200);
            });
        });

        it('Deve garantir a eficácia do filtro: apenas imagens da raça solicitada devem ser retornadas', () => {
            const targetBreed = 'hound';
            const intruderBreed = 'akita';

            cy.request(`${url}/${targetBreed}/images`).then((response) => {
                const images = response.body.message;
                expect(images).to.have.length.greaterThan(0);

                // Teste de isolamento de dados: garante que não há vazamento de outras raças no payload
                images.forEach((url: string) => {
                    expect(url, `A URL ${url} deveria conter a raça ${targetBreed}`)
                        .to.contain(`breeds/${targetBreed}`);

                    expect(url, `Erro de vazamento de dados: a URL contém ${intruderBreed}`)
                        .to.not.contain(`breeds/${intruderBreed}`);
                });
            });
        });

        it('Deve retornar erro 404 ao solicitar imagens de uma raça inexistente', () => {
            const invalidBreed = 'vira-lata-caramelo';

            cy.request({
                url: `${url}/${invalidBreed}/images`,
                failOnStatusCode: false
            }).then((response) => {
                // Teste negativo: valida tratamento de erro e mensagem amigável para recursos inexistentes
                expect(response.status).to.eq(404);
                expect(response.body.status).to.eq('error');
                expect(response.body.message).to.eq('Breed not found (main breed does not exist)');
            });
        });

        it('Deve retornar erro 405 ao tentar um método não permitido', () => {
            cy.request({
                method: 'POST',
                url: url,
                failOnStatusCode: false
            }).then((response) => {
                // Validação de conformidade com o protocolo HTTP e segurança de métodos
                expect(response.status).to.eq(405);
            });
        });
    });
});