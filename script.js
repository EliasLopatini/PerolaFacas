/* ==========================================================
   PÉROLA FACAS
   script.js

   Configurações e cadastro dos produtos
   ========================================================== */


/* ==========================================================
   Produtos
   ========================================================== */

const PRODUCTS = [

    {
        id: "faca-churrasqueira-10",

        name: "Faca Churrasqueira 10\"",

        description:
            "Lâmina em aço inox com fio afiado, cabo em madeira maciça. Ideal pro corte de carnes no churrasco.",

        category: "Facas",

        price_cents: 18990,

        compare_at_cents: 22990,

        images: [],

        stock: 8,

        featured: true,

        active: true,

        sort_order: 1,
    },


    {
        id: "faca-trinchar-carbono",

        name: "Faca de Trinchar Aço Carbono",

        description:
            "Fio que segura o corte por mais tempo, forjada e temperada à mão.",

        category: "Facas",

        price_cents: 24990,

        compare_at_cents: null,

        images: [],

        stock: 5,

        featured: false,

        active: true,

        sort_order: 2,
    },


    {
        id: "kit-churrasco-completo",

        name: "Kit Churrasco Completo",

        description:
            "Faca + garfo trinchante com cabo combinando, em estojo de presente.",

        category: "Facas",

        price_cents: 34990,

        compare_at_cents: 39990,

        images: [],

        stock: 6,

        featured: true,

        active: true,

        sort_order: 3,
    },


   {
    id: "faca-chef-8",

    name: "Faca de Cozinha Chef 8\"",

    description:
        "Uso diário na cozinha, equilíbrio perfeito entre lâmina e cabo.",

    category: "Facas",

    price_cents: 19990,

    compare_at_cents: null,

    images: [],

    stock: 15,

    featured: false,

    active: true,

    sort_order: 4,
},

 {
        id: "garfo-trinchante-guaiaco",

        name: "Garfo Trinchante Cabo Guaiaco",

        description:
            "Par perfeito para servir e segurar as carnes na hora do corte.",

        category: "Garfos",

        price_cents: 7990,

        compare_at_cents: null,

        images: [],

        stock: 12,

        featured: false,

        active: true,

        sort_order: 5,
    },


    {
        id: "fileteira-flexivel-6",

        name: "Fileteira Flexível 6\"",

        description:
            "Lâmina fina e flexível para filetar carnes e peixes com precisão.",

        category: "Fileteiras",

        price_cents: 15990,

        compare_at_cents: null,

        images: [],

        stock: 0,

        featured: false,

        active: true,

        sort_order: 6,
    },


    {
        id: "tabua-carne-grande",

        name: "Tábua de Carne Grande",

        description:
            "Madeira maciça tratada, superfície resistente a cortes profundos.",

        category: "Tábuas",

        price_cents: 21990,

        compare_at_cents: null,

        images: [],

        stock: 10,

        featured: true,

        active: true,

        sort_order: 7,
    },


    {
        id: "tabua-redonda-alca",

        name: "Tábua Redonda com Alça",

        description:
            "Formato compacto com alça vazada, prática para servir à mesa.",

        category: "Tábuas",

        price_cents: 13990,

        compare_at_cents: null,

        images: [],

        stock: 9,

        featured: false,

        active: true,

        sort_order: 8,
    },

];


/* ==========================================================
   Configurações da loja
   ========================================================== */

const STORE_NAME = "Pérola Facas";

const WHATSAPP_NUMBER = "5544998361783";


const CATEGORY_EMOJI = {

    "Facas": "🔪",

    "Garfos": "🍴",

    "Fileteiras": "🔪",

    "Tábuas": "🪵",

};


const LS_CART = "perola_cart_v1";


/* ==========================================================
   Estado inicial
   ========================================================== */

let state = {

    cart: [],

    category: "Todos",

};
/* ==========================================================
    Funções utilitárias
    ========================================================== */


/**
 * Formata valores em reais
 */
function formatBRL(cents) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        }
    ).format(
        (cents || 0) / 100
    );

}


/**
 * Abre conversa no WhatsApp
 */
function waLink(text) {

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
        "_blank"
    );

    return false;

}


/**
 * Sistema de notificações
 */
function toast(message, type = "success") {

    const box = document.getElementById("toasts");

    const element = document.createElement("div");


    element.className =
        "toast " + type;


    element.textContent = message;


    box.appendChild(element);


    setTimeout(
        () => {

            element.remove();

        },
        2600
    );

}


/**
 * Proteção contra HTML inserido pelo usuário
 */
function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            character =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                }[character])
        );

}


function escapeAttr(value) {

    return escapeHtml(value);

}


/**
 * Retorna somente imagens válidas
 */
function productPhotos(product) {

    return (
        product.images || []
    )
    .filter(Boolean);

}


/* ==========================================================
   Carrinho - armazenamento local
   ========================================================== */


/**
 * Carrega carrinho salvo no navegador
 */
function loadCart() {

    try {

        const saved =
            localStorage.getItem(LS_CART);


        state.cart =
            saved
                ? JSON.parse(saved)
                : [];


    } catch (error) {

        state.cart = [];

    }

}


/**
 * Salva carrinho no navegador
 */
function saveCart() {

    try {

        localStorage.setItem(
            LS_CART,
            JSON.stringify(state.cart)
        );


    } catch (error) {

        console.warn(
            "Não foi possível salvar o carrinho."
        );

    }

}


/**
 * Soma total do carrinho
 */
function cartTotalCents() {

    return state.cart.reduce(
        (total, item) => {

            const product =
                PRODUCTS.find(
                    product =>
                        product.id === item.id
                );


            if (!product) {
                return total;
            }


            return (
                total +
                product.price_cents *
                item.qty
            );

        },
        0
    );

}


/**
 * Quantidade total de produtos
 */
function cartCount() {

    return state.cart.reduce(
        (sum, item) =>
            sum + item.qty,
        0
    );

}
    /* ==========================================================
    Carrinho - funções principais
    ========================================================== */


/**
 * Adiciona produto ao carrinho
 */
function addToCart(id) {

    const existing =
        state.cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        existing.qty += 1;

    } else {

        state.cart.push(
            {
                id,
                qty: 1,
            }
        );

    }


    saveCart();

    renderCartBadge();

    renderCartDrawer();


    const product =
        PRODUCTS.find(
            item =>
                item.id === id
        );


    toast(
        `${product.name} adicionado ao carrinho`,
        "success"
    );

}


/**
 * Altera quantidade de um item
 */
function setQty(id, qty) {

    if (qty <= 0) {

        state.cart =
            state.cart.filter(
                item =>
                    item.id !== id
            );

    } else {

        const item =
            state.cart.find(
                product =>
                    product.id === id
            );


        if (item) {

            item.qty = qty;

        }

    }


    saveCart();

    renderCartBadge();

    renderCartDrawer();

}


/**
 * Remove produto do carrinho
 */
function removeFromCart(id) {

    state.cart =
        state.cart.filter(
            item =>
                item.id !== id
        );


    saveCart();

    renderCartBadge();

    renderCartDrawer();

}


/**
 * Limpa todos os produtos
 */
function clearCart() {

    state.cart = [];


    saveCart();

    renderCartBadge();

    renderCartDrawer();

}


/**
 * Finaliza pedido no WhatsApp
 */
function checkoutWhatsapp() {


    if (state.cart.length === 0) {

        return;

    }


    const products =
        state.cart.map(
            item => {

                const product =
                    PRODUCTS.find(
                        p =>
                            p.id === item.id
                    );


                return (
                    `• ${item.qty}x ${product.name} — ` +
                    `${formatBRL(product.price_cents * item.qty)}`
                );

            }
        );


    const message =
        `Olá! Quero finalizar meu pedido na ${STORE_NAME}:\n\n`
        +
        products.join("\n")
        +
        `\n\nTotal: ${formatBRL(cartTotalCents())}`;


    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}


/* ==========================================================
   Carrinho - abertura e fechamento
   ========================================================== */


function openCart() {

    document
        .getElementById("cartOverlay")
        .classList
        .add("show");


    document
        .getElementById("cartDrawer")
        .classList
        .add("show");


    renderCartDrawer();

}


function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList
        .remove("show");


    document
        .getElementById("cartDrawer")
        .classList
        .remove("show");

}


/**
 * Atualiza contador do carrinho
 */
function renderCartBadge() {

    const badge =
        document.getElementById("cartBadge");


    const count =
        cartCount();


    badge.style.display =
        count > 0
            ? "flex"
            : "none";


    badge.textContent =
        count;

}
 /* ==========================================================
    Renderização do carrinho
    ========================================================== */

function renderCartDrawer() {

    const body =
        document.getElementById("cartBody");


    if (state.cart.length === 0) {

        body.innerHTML =
            `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
            `;

    } else {


        body.innerHTML =
            state.cart
                .map(
                    item => {

                        const product =
                            PRODUCTS.find(
                                p =>
                                    p.id === item.id
                            );


                        if (!product) {
                            return "";
                        }


                        const photos =
                            productPhotos(product);


                        const thumb =
                            photos.length
                                ?
                                `
                                <img
                                    src="${escapeAttr(photos[0])}"
                                    alt="${escapeAttr(product.name)}"
                                >
                                `
                                :
                                `
                                <div class="thumb-ph">
                                    ${CATEGORY_EMOJI[product.category] || "📦"}
                                </div>
                                `;


                        return `

                        <div class="cart-item glass-card">

                            ${thumb}

                            <div class="info">

                                <p class="name">
                                    ${escapeHtml(product.name)}
                                </p>


                                <p class="price">
                                    ${formatBRL(product.price_cents)}
                                </p>


                                <div class="qty-row">


                                    <button
                                        class="btn btn-secondary btn-icon"
                                        style="padding:4px;"
                                        onclick="setQty('${product.id}', ${item.qty - 1})"
                                    >
                                        −
                                    </button>


                                    <span>
                                        ${item.qty}
                                    </span>


                                    <button
                                        class="btn btn-secondary btn-icon"
                                        style="padding:4px;"
                                        onclick="setQty('${product.id}', ${item.qty + 1})"
                                    >
                                        +
                                    </button>


                                    <button
                                        class="btn btn-ghost btn-icon"
                                        style="
                                            margin-left:auto;
                                            padding:4px;
                                            color:var(--muted-foreground);
                                        "
                                        onclick="removeFromCart('${product.id}')"
                                    >
                                        🗑
                                    </button>


                                </div>

                            </div>

                        </div>

                        `;

                    }
                )
                .join("");

    }


    document
        .getElementById("cartTotal")
        .textContent =
            formatBRL(
                cartTotalCents()
            );


    document
        .getElementById("checkoutBtn")
        .disabled =
            state.cart.length === 0;

}


/* ==========================================================
   Produtos e categorias
   ========================================================== */


function activeProducts() {

    return PRODUCTS

        .filter(
            product =>
                product.active
        )

        .sort(
            (a, b) =>
                a.sort_order -
                b.sort_order
        );

}


/**
 * Cria filtros de categoria
 */
function renderCategoryFilters() {

    const categories =
        [
            "Todos",
            ...new Set(
                activeProducts()
                    .map(
                        product =>
                            product.category
                    )
            ),
        ];


    const container =
        document.getElementById("catFilters");


    container.innerHTML =
        categories
            .map(
                category =>
                    `
                    <button
                        class="
                            btn
                            btn-sm
                            ${
                                category === state.category
                                ? "btn-primary"
                                : "btn-secondary"
                            }
                        "
                        onclick="setCategory('${escapeAttr(category)}')"
                    >
                        ${escapeHtml(category)}
                    </button>
                    `
            )
            .join("");

}


function setCategory(category) {

    state.category =
        category;


    renderStorefront();

}
 /* ==========================================================
    Renderização da vitrine
    ========================================================== */


function renderStorefront() {

    renderCategoryFilters();


    const products =
        activeProducts()
            .filter(
                product =>
                    state.category === "Todos"
                    ||
                    product.category === state.category
            );


    const area =
        document.getElementById("productsArea");


    if (products.length === 0) {

        area.innerHTML =
            `
            <div class="empty-box glass-card">

                <h3>
                    Nenhum produto por aqui ainda
                </h3>


                <p>
                    Adicione produtos na lista PRODUCTS
                    para aparecerem na loja.
                </p>

            </div>
            `;


        return;

    }


    area.innerHTML =
        `
        <div class="grid-products">

            ${
                products
                    .map(productCardHTML)
                    .join("")
            }

        </div>
        `;


    products.forEach(
        product =>
            initGallery(product.id)
    );

}



/* ==========================================================
   Card do produto
   ========================================================== */


function productCardHTML(product) {


    const photos =
        productPhotos(product);


    const soldOut =
        product.stock <= 0;



    const imageArea =
        photos.length

        ?

        photos
            .map(
                (image, index) =>
                    `
                    <img
                        src="${escapeAttr(image)}"
                        class="${index === 0 ? "active" : ""}"
                        data-i="${index}"
                        alt="${escapeAttr(product.name)}"
                        style="cursor:zoom-in;"
                        onclick="openLightbox('${product.id}',${index})"
                    >
                    `
            )
            .join("")


        :

        `
        <div class="placeholder">

            <span>
                ${CATEGORY_EMOJI[product.category] || "📦"}
            </span>


            <span class="cat">
                ${escapeHtml(product.category)}
            </span>

        </div>
        `;



    return `

    <article class="card glass-card">


        <div
            class="gallery"
            id="gal-${product.id}"
            data-index="0"
            data-total="${photos.length}"
        >


            ${imageArea}


            ${
                product.featured

                ?

                `
                <span class="badge">
                    Destaque
                </span>
                `

                :

                ""
            }



            ${
                soldOut

                ?

                `
                <div class="soldout">
                    ESGOTADO
                </div>
                `

                :

                ""
            }


        </div>



        <div class="card-body">


            <span class="eyebrow-sm">

                ${escapeHtml(product.category)}

            </span>



            <h3>

                ${escapeHtml(product.name)}

            </h3>



            <p class="desc">

                ${escapeHtml(product.description || "")}

            </p>



            <div class="price-row">


                <div>


                    ${
                        product.compare_at_cents
                        &&
                        product.compare_at_cents > product.price_cents

                        ?

                        `
                        <p class="price-strike">

                            ${formatBRL(product.compare_at_cents)}

                        </p>
                        `

                        :

                        ""
                    }



                    <p class="price-now">

                        ${formatBRL(product.price_cents)}

                    </p>


                </div>




                <button

                    class="
                        btn
                        btn-primary
                        btn-sm
                    "

                    ${
                        soldOut
                        ? "disabled"
                        : ""
                    }

                    onclick="addToCart('${product.id}')"

                >

                    +

                    Adicionar

                </button>


            </div>



            <button

                class="
                    btn
                    btn-outline
                    btn-sm
                    btn-block
                "

                onclick="
                    return waLink(
                    'Olá! Tenho interesse na ${escapeAttr(product.name)}
                    (${escapeAttr(formatBRL(product.price_cents))}).'
                    )
                "

            >

                💬

                Pedir no WhatsApp

            </button>



        </div>


    </article>

    `;

}
 /* ==========================================================
    Galeria de imagens dos produtos
    ========================================================== */


const galleryTimers = {};


/**
 * Inicia rotação automática
 */
function initGallery(id) {


    const gallery =
        document.getElementById(
            "gal-" + id
        );


    if (!gallery) return;


    const total =
        parseInt(
            gallery.dataset.total,
            10
        );


    if (total < 2) return;



    if (galleryTimers[id]) {

        clearInterval(
            galleryTimers[id]
        );

    }



    galleryTimers[id] =
        setInterval(
            () => {

                const current =
                    parseInt(
                        gallery.dataset.index,
                        10
                    );


                galGo(
                    id,
                    (current + 1) % total
                );


            },
            3500
        );



    gallery.addEventListener(
        "mouseenter",
        () =>
            clearInterval(
                galleryTimers[id]
            )
    );



    gallery.addEventListener(
        "mouseleave",
        () =>
            initGallery(id)
    );

}



/**
 * Troca imagem da galeria
 */
function galGo(id, index) {


    const gallery =
        document.getElementById(
            "gal-" + id
        );


    if (!gallery) return;



    gallery.dataset.index =
        index;



    gallery
        .querySelectorAll("img")
        .forEach(
            img =>
                img.classList.toggle(
                    "active",
                    Number(img.dataset.i) === index
                )
        );

}



/* ==========================================================
   Lightbox
   ========================================================== */


let lb = {

    open:false,

    photos:[],

    index:0,

    name:"",

};



function openLightbox(productId,index) {


    const product =
        PRODUCTS.find(
            item =>
                item.id === productId
        );


    const photos =
        productPhotos(product);



    if (!photos.length) return;



    lb.photos =
        photos;


    lb.index =
        index;


    lb.name =
        product.name;


    lb.open =
        true;



    renderLightbox();



    document
        .getElementById(
            "lightboxOverlay"
        )
        .classList
        .add("show");



    document.body.style.overflow =
        "hidden";

}



function closeLightbox() {


    if (!lb.open) return;



    lb.open =
        false;



    document
        .getElementById(
            "lightboxOverlay"
        )
        .classList
        .remove("show");



    document.body.style.overflow =
        "";

}



function lbNav(direction) {


    const total =
        lb.photos.length;



    lb.index =
        (
            lb.index +
            direction +
            total
        )
        %
        total;



    renderLightbox();

}



function renderLightbox() {


    const image =
        document.getElementById(
            "lightboxImg"
        );


    image.src =
        lb.photos[lb.index];


    image.alt =
        lb.name;



    const counter =
        document.getElementById(
            "lightboxCounter"
        );


    counter.textContent =
        `${lb.index + 1} / ${lb.photos.length}`;


}



/* ==========================================================
   Teclas do teclado
   ========================================================== */


window.addEventListener(
    "keydown",
    event => {


        if (!lb.open) return;



        if (event.key === "Escape") {

            closeLightbox();

        }



        if (event.key === "ArrowRight") {

            lbNav(1);

        }



        if (event.key === "ArrowLeft") {

            lbNav(-1);

        }


    }
);



/* ==========================================================
   Inicialização do site
   ========================================================== */


document
    .getElementById("footerYear")
    .textContent =
        "© "
        +
        new Date().getFullYear()
        +
        " — Pedidos e dúvidas pelo WhatsApp.";



loadCart();

renderCartBadge();

renderCartDrawer();

renderStorefront();
