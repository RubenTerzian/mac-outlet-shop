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

const renderCard = device =>{
    const card = cElem('div','card');
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
                    
                    const btnAddToCart = cElem('button');
                    btnAddToCart.innerText = 'Add to cart';
                    if(amountOfItems.innerText != 0){
                        leftInStockImg.src = 'img/icons/check 1.svg';
                    }else{
                        leftInStockImg.src = "img/icons/close 1.svg";
                        leftInStockImgWraper.setAttribute('class', 'left-in-stock__zero');
                        btnAddToCart.setAttribute('disabled', '');
                    }
        cardTop.append(favorite,itemImageWraper, h6, leftInStock, priceWraper, btnAddToCart);
        
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
        card.append(cardTop, cardBottom);
        
        return card;
    };

const renderCards = list =>{
    const elems = list.map(item => renderCard(item));
    listContainer.clear().add(elems);
};

renderCards(items);

