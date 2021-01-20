const cElem = (tagName, className) =>{
    const elem = document.createElement(tagName, className);
    elem.className = className || '';
    return elem;
};


const gElem = (param)=>{
    const elem = document.querySelector(param);
    elem.clear = function(){
        this.innerHtml = '';
        return this;
    }
    elem.add = function(listOfElems){
        this.append(...listOfElems);
        return this;
    }
    return elem;
};

const listContainer = gElem('.container');

const renderCardBottom = device=>{
    const cardBottom = cElem('div', 'card__bottom');
        const favoriteFilled = cElem('div','favorite');
        const imgFavoriteFilled = cElem('img');
        imgFavoriteFilled.src = 'img/icons/like_filled 1.svg';
        imgFavoriteFilled.alt = 'Image';
        favoriteFilled.append(imgFavoriteFilled);
        
        const positiveReview = cElem('span', 'positive-review');
        const textWraper = cElem('div');
        const pRAmount = cElem('p', 'positive-review__amount')
        pRAmount.innerText = device.orderInfo.reviews;
        const textPR = cElem ('p');
        textPR.innerText = '% Positive reviews';
        textWraper.append(pRAmount, textPR);
        
        const pRText = cElem('p');
        pRText.innerText = 'Above avarage';
        positiveReview.append(textWraper, pRText);
        
        const ordersWraper = cElem('span', 'orders');
        const ordersAmount = cElem('p', 'oreders__amount');
        ordersAmount.innerText = '527'
        const ordersText = cElem('p');
        ordersText.innerText = 'Orders';
        ordersWraper.append(ordersAmount, ordersText);
    cardBottom.append(favoriteFilled, positiveReview, ordersWraper);
    return cardBottom;
}

const renderCard = device =>{
    const card = cElem('div','card');
    card.id = device.id;
        const cardTop = cElem('div','card__top');
            const favorite = cElem('div','favorite');
                const imgFavorite = cElem('img');
                imgFavorite.src = 'img/icons/like_empty.svg';
                imgFavorite.alt = 'Image';
            favorite.append(imgFavorite);

            const itemImageWraper = cElem('div', 'item-image');
                const itemImage = cElem('img');
                itemImage.src = `img/${device.imgUrl}`;
            itemImageWraper.append(itemImage);

            const h6 = cElem('h6');
            h6.innerText = device.name;
            const leftInStock = cElem('span', 'left-in-stock');
                const leftInStockImgWraper = cElem('span', 'left-in-stock__check');
                    const leftInStockImg = cElem('img');
                    leftInStockImgWraper.append(leftInStockImg);
                    
                    const amountOfItems = cElem('span', 'left-in-stock__amount-of-items');
                    amountOfItems.innerText = device.orderInfo.inStock;
                    const textLIS = cElem('p');
                    textLIS.innerText = 'left in stock';
                    leftInStock.append(leftInStockImgWraper, amountOfItems, textLIS);
                    
                    const priceWraper = cElem('span', 'price');
                    const textP = cElem('p');
                    textP.innerText = 'Price: ';
                    const priceAmount = cElem('span', 'price__amount');
                    priceAmount.innerText = device.price;
                    const priceCurrency = cElem('span', 'price__currency');
                    priceCurrency.innerText = '$';
                    priceWraper.append(textP, priceAmount, priceCurrency);
                    
                    const btnAddToCart = cElem('button', 'btn-add-to-cart');
                    btnAddToCart.innerText = 'Add to cart';
                    if(amountOfItems.innerText != 0){
                        leftInStockImg.src = 'img/icons/check 1.svg';
                    }else{
                        leftInStockImg.src = "img/icons/close 1.svg";
                        leftInStockImgWraper.setAttribute('class', 'left-in-stock__zero');
                        btnAddToCart.setAttribute('disabled', '');
                    }
        cardTop.append(favorite,itemImageWraper, h6, leftInStock, priceWraper, btnAddToCart);
        
        const cardBottom = renderCardBottom(device);
        card.append(cardTop, cardBottom);
        
        return card;
    };

const renderCards = list =>{
    const elems = list.map(item => renderCard(item));
    listContainer.clear().add(elems);
};

renderCards(items);

//   Render modal window of element


const modalWindow = document.querySelector('#modal');
const renderModal = (device)=>{
    const cardBottom = renderCardBottom(device);
    const modalItemSpecifications = cElem('div', 'modal-item-specifications');
    const renderSpecifications = (name, value)=>{
        const specifications = cElem('div', 'specifications');
        const specificationsName = cElem('p', 'specifications__name');
        specificationsName.innerText = name;
        const specificationsValue = cElem('p', 'specifications__value');
        specificationsValue.innerText = value;

        specifications.append(specificationsName, specificationsValue);
        modalItemSpecifications.append(specifications);
    }
    Object.keys(device).forEach(key =>{
        renderSpecifications(key, device[key]);
    });

    let btnDisabled = device.orderInfo.inStock == 0 ? 'disabled':''
    const modalContent = cElem('div', 'modal__content');
    modalContent.innerHTML = `
    <div class="modal__content__left">
        <div class="modal-item-image">
            <img src="img/${device.imgUrl}" alt="image">
        </div>
    </div>
    <div class="modal__content__middle">
        <div class="modal__content__middle__wraper">
            <h3 class="item-title">${device.name}</h3>
            <div class="from-card__bottom">
                <div class="card__bottom">
                    ${cardBottom.innerHTML}
                </div>
            </div>
            <div class="modal-item-specifications">
                ${modalItemSpecifications.innerHTML}
            </div>
        </div>
    </div>
    <div class="modal__content__right">
        <div class="modal-item-price">
            <p>$</p><p>${device.price}</p>
        </div>
        <div class="modal-stock">
            <p>Stock:</p><p>${device.orderInfo.inStock}</p><p>pcs.</p>
        </div>
        <button class="btn-add-to-cart"${btnDisabled}>Add to cart</button>
    </div>
    `
    modalWindow.append(modalContent);
}

// Hide and clear madal window
modalWindow.addEventListener('click', event =>{
    if(event.target.className === 'modal'){
       event.target.innerText='';
       event.target.className += " disabled";
    };
})


const container = document.querySelector('.container');
const card = document.querySelectorAll('.card');
const btnAddToCart = document.querySelectorAll('.btn-add-to-cart');

// Show and render modal Window

card.forEach(el => el.addEventListener('click', event =>{
    event.path.forEach(el => 
            {if(el.className === 'card'){
                const item = items.find(dev=>dev.id == el.id)
                renderModal(item);
                modalWindow.setAttribute('class', 'modal');
        }
    });
}));

// Add to cart

btnAddToCart.forEach(el => el.addEventListener('click', event =>{
        console.log('btn');
        event.stopPropagation();
    
 })) 

 const specifications = {};
 items.forEach(el => {
     specifications(...el);

 })
 console.log(specifications);