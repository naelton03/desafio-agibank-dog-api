class BlogPage {
    private selectors = {
        url: 'https://blog.agibank.com.br/',
        bannerImg: 'img[src*="banner1200-consig-2025"]',
        linkWhats: 'a[href*="api.whatsapp.com/send"]'
    };

    acessarBlog(): void {
        cy.visit(this.selectors.url);

    }

    prepararAcessibilidade(): void {
        cy.injectAxe(); 
    }

    getBannerConsignado(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(this.selectors.bannerImg);
    }

    getLinkWhatsapp(): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(this.selectors.linkWhats);
    }
}

export default new BlogPage();