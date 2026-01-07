# Desafio de Automação de API - Dog API

Este repositório contém a suíte de testes automatizados para a [Dog API](https://dog.ceo/dog-api/), desenvolvida para validar os endpoints `/breeds/list/all`, `/breed/{breed}/images` e `/breeds/image/random`. O projeto foca em garantir a integridade dos dados, a conformidade dos contratos e a resiliência do sistema.

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Cypress](https://www.cypress.io/) (v13+)
* **Linguagem:** TypeScript
* **Validação de Contrato:** [AJV](https://ajv.js.org/) (JSON Schema Validator)
* **Relatórios:** [Mochawesome](https://github.com/adamgruber/mochawesome)
* **Gerenciador de Pacotes:** pnpm

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js (v18 ou superior)
* pnpm instalado (`npm install -g pnpm`)

### Passo a Passo
1.  **Instalação:** Na raiz do projeto, instale as dependências:
    ```bash
    pnpm install
    ```

2.  **Execução via Interface Visual:**
    ```bash
    pnpm cy:open
    ```

3.  **Execução via Terminal (Modo Headless):**
    ```bash
    pnpm cy:run
    ```

---

## 📋 Relatório Mochawesome

Este projeto utiliza o **Mochawesome** para gerar relatórios detalhados em HTML. O processo é automatizado para limpar execuções anteriores, rodar os testes e consolidar os arquivos JSON em um único dashboard visual.

### Como visualizar o relatório localmente:
Após executar o comando `pnpm test`, a pasta `cypress/reports/html` será criada.

* **Caminho:** `./cypress/reports/html/report.html`
* **Ação:** Abra o arquivo acima em qualquer navegador para visualizar os detalhes de cada request e as evidências de falha.

### Como visualizar o relatório na Pipeline (GitHub Actions):
1. Acesse a aba **Actions** no seu repositório GitHub.
2. Clique na execução mais recente do Workflow (**Cypress Tests**).
3. Role até o final da página até a seção **Artifacts**.
4. Baixe o arquivo `cypress-html-report`, extraia o conteúdo e abra o arquivo `report.html`.


### 2. Detalhamento por Spec

#### **Spec: `breeds_list_all.cy.ts` (Listagem)**
* **Status:** ✅ 100% Passing
* **Validações:** Contrato via JSON Schema, ordenação alfabética das raças e tempo de resposta (SLA).

#### **Spec: `breed_images_random.cy.ts` (Imagem Aleatória)**
* **Status:** ✅ 100% Passing
* **Validações:** Validação de formato de URL (Regex), teste de variabilidade (idempotência) e integridade do link de imagem.

#### **Spec: `breed_images.cy.ts` (Imagens por Raça)**
* **Status:** ✖ 1 Fail / 4 Passing
* **Validações:** Filtro de raça correto no payload e integridade das extensões de arquivo.
* **Causa da Falha:** Teste de conformidade HTTP (POST em endpoint GET).

---

### 🔍 Análise Técnica da Falha (Bug Report)

Durante a execução da spec `breed_images.cy.ts`, foi identificado um comportamento que diverge dos padrões REST e da própria consistência interna da API.

* **Cenário:** Chamada de método não permitido (`POST`) no endpoint `/breed/{breed}/images`.
* **Resultado Esperado:** `405 Method Not Allowed`.
* **Resultado Obtido:** `404 Not Found`.
* **Evidência do Cypress:** `AssertionError: expected 404 to equal 405`.
* **Análise do QA:** Enquanto os demais endpoints da Dog API (como o `/random`) retornam o erro 405 corretamente para métodos proibidos, este endpoint específico falha na semântica HTTP. A falha foi mantida no relatório para evidenciar a necessidade de padronização no backend.
---
