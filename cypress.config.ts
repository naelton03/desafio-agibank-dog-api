import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Configuração do gerador de relatórios
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    
    // Configurações de execução
    baseUrl: 'https://dog.ceo/api',
    video: false, // Desabilitado para ganhar performance no pnpm test
    screenshotOnRunFailure: true, // Tira print automático se o teste falhar
    
    setupNodeEvents(on, config) {
      // Evento para ignorar erros não capturados da aplicação/API
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    
    // Suporte para TypeScript e arquivos de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
});