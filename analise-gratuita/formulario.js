function iniciarFormularioAnaliseLanding() {

    const form =
        document.querySelector(
            "#formAnaliseLanding"
        );

    if (!form) return;


    const nomeInput =
        form.querySelector(
            "#analiseNome"
        );

    const emailInput =
        form.querySelector(
            "#analiseEmail"
        );

    const urlInput =
        form.querySelector(
            "#analiseUrl"
        );

    const csrfInput =
        form.querySelector(
            "#csrfAnalise"
        );

    const botao =
        form.querySelector(
            "#btnEnviarAnalise"
        );

    const erro =
        form.querySelector(
            "#erroAnalise"
        );

    const sucesso =
        form.querySelector(
            "#sucessoAnalise"
        );


    let turnstileWidgetId =
        null;


    /*
    =========================================
    TERMOS PROIBIDOS
    =========================================
    */

    const termosBloqueados = [
        "teste",
        "test",
        "fake",
        "falso",
        "example",
        "exemplo",
        "demo",
        "sample",
        "asdf",
        "qwerty"
    ];


    function normalizar(valor) {

        return valor
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }


    function possuiTermoBloqueado(valor) {

        const texto =
            normalizar(valor);

        return termosBloqueados.some(
            termo =>
                texto.includes(termo)
        );
    }


    /*
    =========================================
    MENSAGENS
    =========================================
    */

    function limparMensagens() {

        erro.textContent = "";

        erro.classList.remove(
            "ativo"
        );


        sucesso.textContent = "";

        sucesso.classList.remove(
            "ativo"
        );


        form
            .querySelectorAll(
                ".campoAnalise"
            )
            .forEach(campo => {

                campo.classList.remove(
                    "invalido"
                );

            });
    }


    function mostrarErro(
        input,
        mensagem
    ) {

        limparMensagens();


        const campo =
            input?.closest(
                ".campoAnalise"
            );


        if (campo) {

            campo.classList.add(
                "invalido"
            );

        }


        erro.textContent =
            mensagem;


        erro.classList.add(
            "ativo"
        );


        input?.focus();
    }


    /*
    =========================================
    NOME
    =========================================
    */

    function validarNome() {

        const nome =
            nomeInput.value.trim();


        if (
            nome.length < 2
            ||
            nome.length > 80
        ) {

            mostrarErro(
                nomeInput,
                "Digite um nome válido."
            );

            return false;
        }


        if (
            possuiTermoBloqueado(
                nome
            )
        ) {

            mostrarErro(
                nomeInput,
                "Digite seu nome real."
            );

            return false;
        }


        const regexNome =
            /^[\p{L}\p{M}'’.\-\s]+$/u;


        if (
            !regexNome.test(nome)
        ) {

            mostrarErro(
                nomeInput,
                "Digite um nome válido."
            );

            return false;
        }


        return true;
    }


    /*
    =========================================
    EMAIL
    =========================================
    */

    function validarEmail() {

        const email =
            emailInput
                .value
                .trim()
                .toLowerCase();


        if (
            email.length < 5
            ||
            email.length > 150
        ) {

            mostrarErro(
                emailInput,
                "Digite um e-mail válido."
            );

            return false;
        }


        if (
            possuiTermoBloqueado(
                email
            )
        ) {

            mostrarErro(
                emailInput,
                "Digite seu e-mail real."
            );

            return false;
        }


        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


        if (
            !regexEmail.test(email)
        ) {

            mostrarErro(
                emailInput,
                "Digite um e-mail válido."
            );

            return false;
        }


        return true;
    }


    /*
    =========================================
    LANDING PAGE
    =========================================
    */

    function validarUrl() {

        let valor =
            urlInput.value.trim();


        if (!valor) {

            mostrarErro(
                urlInput,
                "Informe o endereço da sua Landing Page."
            );

            return false;
        }


        if (
            !/^https?:\/\//i.test(
                valor
            )
        ) {

            valor =
                "https://" + valor;

        }


        try {

            const url =
                new URL(valor);


            if (
                ![
                    "http:",
                    "https:"
                ].includes(
                    url.protocol
                )
            ) {

                throw new Error();

            }


            const host =
                url.hostname
                    .toLowerCase();


            if (
                !host.includes(".")
                ||
                host === "localhost"
            ) {

                throw new Error();

            }


            if (
                possuiTermoBloqueado(decodeURI(url.href))
            ) {

                mostrarErro(
                    urlInput,
                    "Informe o endereço real da sua Landing Page."
                );

                return false;
            }


            urlInput.value =
                valor;


        } catch {

            mostrarErro(
                urlInput,
                "Digite uma URL válida."
            );

            return false;
        }


        return true;
    }


    /*
    =========================================
    REMOVE ERRO QUANDO VOLTAR A DIGITAR
    =========================================
    */

    [
        nomeInput,
        emailInput,
        urlInput

    ].forEach(input => {

        input.addEventListener(
            "input",
            () => {

                input
                    .closest(
                        ".campoAnalise"
                    )
                    ?.classList
                    .remove(
                        "invalido"
                    );


                if (turnstileWidgetId !== null) {
                    erro.classList.remove("ativo");
                }

            }
        );

    });


    /*
    =========================================
    INICIALIZA SEGURANÇA

    Busca:
    - CSRF
    - Site Key pública Turnstile
    =========================================
    */

    async function iniciarSeguranca() {

        botao.disabled =
            true;


        try {

            const resposta =
                await fetch(
                    form.action,
                    {
                        method: "GET",

                        credentials:
                            "same-origin",

                        cache:
                            "no-store"
                    }
                );


            const dados =
                await resposta.json();


            if (
                !resposta.ok
                ||
                !dados.success
            ) {

                throw new Error(
                    dados.message ||
                    "Erro de segurança."
                );

            }


            csrfInput.value =
                dados.csrf_token;


            if (
                typeof window.turnstile
                ===
                "undefined"
            ) {

                throw new Error(
                    "A proteção antirrobô não foi carregada."
                );

            }


            turnstileWidgetId =
                window.turnstile.render(
                    "#turnstileAnalise",
                    {

                        sitekey:
                            dados.turnstile_site_key,

                        theme:
                            "dark",

                        appearance:
                            "always",

                        language: "pt-BR",
                        callback: () => {
                            if (erro.dataset.protecao === "true") {
                                erro.classList.remove("ativo");
                                delete erro.dataset.protecao;
                            }
                        },
                        "error-callback": code => {
                            console.warn("Turnstile análise: falha de verificação", code);
                            erro.textContent = "A verificação de segurança não conseguiu concluir. Confira o aviso da Cloudflare abaixo dos campos.";
                            erro.dataset.protecao = "true";
                            erro.classList.add("ativo");
                        },
                        "expired-callback": () => {
                            if (turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
                        },
                        "timeout-callback": () => {
                            if (turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
                        },

                        action:
                            "analise_landing"

                    }
                );


            botao.disabled =
                false;


        } catch (error) {

            erro.textContent =
                "Não foi possível carregar a proteção do formulário. Atualize a página.";

            erro.classList.add(
                "ativo"
            );

        }

    }


    /*
    =========================================
    ENVIO
    =========================================
    */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparMensagens();


            if (!validarNome()) {
                return;
            }


            if (!validarEmail()) {
                return;
            }


            if (!validarUrl()) {
                return;
            }


            if (
                !csrfInput.value
            ) {

                erro.textContent =
                    "A sessão de segurança não foi carregada. Atualize a página.";

                erro.classList.add(
                    "ativo"
                );

                return;
            }


            /*
            =========================================
            TOKEN TURNSTILE
            =========================================
            */

            const tokenTurnstile =
                window.turnstile
                    ?.getResponse(
                        turnstileWidgetId
                    );


            if (
                !tokenTurnstile
            ) {

                erro.textContent =
                    "Aguarde a verificação de segurança. Se aparecer uma caixa de confirmação, conclua-a antes de enviar.";

                erro.dataset.protecao = "true";
                document.getElementById("turnstileAnalise")?.scrollIntoView({ block: "center", behavior: "smooth" });

                erro.classList.add(
                    "ativo"
                );

                return;
            }


            const htmlOriginal =
                botao.innerHTML;


            botao.disabled =
                true;


            botao.innerHTML =
                `
                    <span class="btnAnaliseTexto">
                        ENVIANDO...
                    </span>
                `;


            try {

                const dadosForm =
                    new FormData(
                        form
                    );


                dadosForm.set(
                    "cf-turnstile-response",
                    tokenTurnstile
                );


                const resposta =
                    await fetch(
                        form.action,
                        {

                            method:
                                "POST",

                            body:
                                dadosForm,

                            credentials:
                                "same-origin"

                        }
                    );


                const dados =
                    await resposta.json();


                if (
                    !resposta.ok
                    ||
                    !dados.success
                ) {

                    throw new Error(
                        dados.message ||
                        "Não foi possível enviar sua solicitação."
                    );

                }


                form.reset();


                if (
                    dados.csrf_token
                ) {

                    csrfInput.value =
                        dados.csrf_token;

                }


                window.turnstile.reset(
                    turnstileWidgetId
                );


                sucesso.textContent =
                    "Solicitação enviada. Vou analisar sua página e entrar em contato pelo e-mail informado.";


                sucesso.classList.add(
                    "ativo"
                );
                window.registrarLeadDaiane?.('analise_gratuita');


            } catch (error) {

                erro.textContent =
                    error.message ||
                    "Não foi possível enviar. Tente novamente.";


                erro.classList.add(
                    "ativo"
                );


                if (
                    turnstileWidgetId
                    !==
                    null
                ) {

                    window.turnstile.reset(
                        turnstileWidgetId
                    );

                }


            } finally {

                botao.disabled =
                    false;


                botao.innerHTML =
                    htmlOriginal;

            }

        }
    );


    iniciarSeguranca();
}


document.addEventListener(
    "DOMContentLoaded",
    iniciarFormularioAnaliseLanding
);
