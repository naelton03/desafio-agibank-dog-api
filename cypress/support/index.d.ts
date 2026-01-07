declare global {
    namespace Cypress {
        interface Chainable {
            pesquisarNoBlog(termo: string): Chainable<void>;
            injectAxe(): Chainable<void>;
            checkA11y(context?: any, options?: any, label?: any, skipFailures?: boolean): Chainable<void>;
            getBannerConsignado(): Cypress.Chainable<JQuery<HTMLElement>>;
            getLinkWhatsapp(): Cypress.Chainable<JQuery<HTMLElement>>;
        }
    }
}

export { };