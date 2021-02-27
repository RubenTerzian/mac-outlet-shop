const cElem = (tagName, className) =>{
    const elem = document.createElement(tagName, className);
    elem.className = className || '';
    return elem;
};


const gElem = (param)=>{
    const elem = document.querySelector(param);
    elem.clear = function(){
        this.innerHTML = '';
        return this;
    }
    elem.add = function(listOfElems){
        this.append(...listOfElems);
        return this;
    }
    return elem;
};

const listContainer = gElem('.cards-container');

//   Render modal window of element


const modalWindow = document.querySelector('#modal');
const renderModal = (device)=>{
    const cardBottom = renderCardBottom(device);
    const modalItemSpecifications = cElem('div', 'modal-item-specifications');

    // Render specifications
    const renderSpecifications = (name, value, units)=>{
        const specifications = cElem('div', 'specifications');
        const specificationsName = cElem('p', 'specifications__name');
        specificationsName.innerText = `${name}: `;
        const specificationsValue = cElem('p', 'specifications__value');
        specificationsValue.innerText = `${value} ${units || ''}`;

        specifications.append(specificationsName, specificationsValue);
        modalItemSpecifications.append(specifications);
    }
    const deviceKeys = Object.keys(device);
    renderSpecifications('display', device.display, 'inch');
    renderSpecifications('color', device.color.join('/  '));
    renderSpecifications('chip', device.chip.name);
    renderSpecifications('ram', device.ram, 'GB');
    renderSpecifications('storage', device.storage, 'GB');
    renderSpecifications('height', device.size.height, 'cm');
    renderSpecifications('width', device.size.width, 'cm');
    renderSpecifications('depth', device.size.depth, 'cm');
    renderSpecifications('weight', device.size.weight*1000, 'g');
    renderSpecifications('InTheBox', device.InTheBox.join('/  '));

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
    const btnAddToCartModal = document.querySelector('.modal__content__right');
    addToCart(btnAddToCartModal.children[2], device)
}

// Hide and clear madal window
modalWindow.addEventListener('click', event =>{
    if(event.target.className === 'modal'){
       event.target.innerText='';
       event.target.className += " disabled";
    };
})

const container = document.querySelector('.cards-container');

const showModal = (card, item)=>{
    // Show and render modal Window
    
    card.addEventListener('click', () =>{

        renderModal(item);
        modalWindow.setAttribute('class', 'modal');
    })
       
};

//   ASIDE FILTER

const createFilterItem = (name, nameForShow, units) =>{
    const filterAside = document.querySelector('.filter');
    const filterItem = cElem('div', 'filter__item');
    filterItem.id = name;
    filterItem.innerHTML= `
    <div class="filter__item__name">
        <p>${nameForShow || name}</p>
        <div class="filter-arrow">
            <img src="img/icons/filter-arrow.svg" alt="image">
        </div>
    </div>
    `;

    filterAside.append(filterItem);
    const paramArray =[];
    const objectParamArray =[];

    // take value "name" from all elements and put it into an array

    items.forEach(el =>{
        if(typeof(el[name]) === 'string'){
            paramArray.push(el[name])
            paramArray.sort();
        }
        if(typeof(el[name]) === 'number'){
            if(el[name]%1 == 0){
                const validNumb = el[name];
                paramArray.push(validNumb)
            }else{
                const validNumb = el[name].toFixed(1);
                paramArray.push(validNumb)
            }
        } 
        if(Array.isArray(el[name])){
            objectParamArray.push(el[name]) 
        }   
    })

    // If array of items conteins array
    objectParamArray.forEach(el=>{
        for(let key in el){
            paramArray.push(el[key]);
        }
    })

    // Create array with unic values
    const unicValueArray = paramArray.filter((element, index, array)=>{
        return array.indexOf(element) === index
    });
    
    const filterItemValue = cElem('div', 'filter__item__value');
    filterItem.append(filterItemValue);

    // create render param function
    const renderParam =(param)=>{
        const filterParam = cElem('div', 'filter-param');
        filterParam.innerHTML= `
        <div class="filter-param__input">
        <input type="checkbox">
        </div>
        <p>${param}</p><p>${units || ''}</p>
        `
        filterItemValue.append(filterParam)
    }

    // Sort array elements in ascending order
    unicValueArray.sort( (a, b) => a - b )

    // logic for rendering "filter__item__value"
    if(name !== 'display' && name !== 'price'){
        unicValueArray.forEach(el =>{
            renderParam(el);
        })
    }
    if(name === 'price'){
        const easyBasketFilter = cElem('div', 'easy-basket-filter');
        const minValue = unicValueArray[0]
        const maxValue = unicValueArray[unicValueArray.length-1]
        easyBasketFilter.innerHTML=`
            <div class="easy-basket-filter-info">
                <p class="iLower"><input type="text" class="easy-basket-lower" value="${minValue}" min="${minValue}" max="${maxValue}" maxlength=4/></p>
                <p class="iUpper"><input type="text" class="easy-basket-upper" value="${maxValue}" min="${minValue}" max="${maxValue}" maxlength=4/></p>
            </div>
            
            <div class="easy-basket-filter-range">
                <input type="range" class="lower range" min="${minValue}" max="${maxValue}" value="${minValue}"/>
                <input type="range" class="upper range" min="${minValue}" max="${maxValue}" value="${maxValue}"/>
                <div class="fill"></div>
            </div>
        `
        filterItemValue.append(easyBasketFilter)
    }
    if(name === 'display'){
        const rangeArray =[]
        const l = unicValueArray.length
        const lastElemOfUniArray = unicValueArray[l-1]
        const firstNumb = Math.floor(unicValueArray[0])
        const secondNumb = firstNumb + Math.floor(lastElemOfUniArray/5)
        const thirdNumb = secondNumb + Math.floor(lastElemOfUniArray/5)
        const fourthNumb = thirdNumb + Math.floor(lastElemOfUniArray/5)
        const fifthNumb = lastElemOfUniArray
        rangeArray.push(firstNumb, secondNumb, thirdNumb, fourthNumb, fifthNumb)
        for(let i=0; rangeArray.length>=1;){
            if(rangeArray.length == 1){
                const param = `+ ${rangeArray[i]}`
                renderParam(param)
                rangeArray.splice(i, 1);
            }else{
                const param = `${rangeArray[i]} - ${rangeArray[(i+1)]}`
                renderParam(param)
                rangeArray.splice(i, 1);
            }
        }
    }
}

createFilterItem('price', 'Price', '$');
createFilterItem('color', 'Color');
createFilterItem('storage', 'Memory', 'GB');
createFilterItem('category', 'OS');
createFilterItem('display', 'Display', 'inch');



// OPEN FILTER
const filterItems = document.querySelectorAll('.filter__item__name');
filterItems.forEach(el => el.addEventListener('click', event =>{
    event.path.forEach(el => 
            {if(el.className === 'filter__item__name'){ 
                el.className = 'filter__item__name active';
                el.parentNode.children[1].className ='filter__item__value active'
                return
        }
        if(el.className === 'filter__item__name active'){ 
            el.className = 'filter__item__name';
            el.parentNode.children[1].className ='filter__item__value'
            return
    }
    });
}));

//  Find price inputs and take value

const filterPriceInputsArray = []
const crollLow = document.querySelector('.lower');
const crollUp = document.querySelector('.upper');
const filterPriceMinValueIpnut = document.querySelector('.easy-basket-lower');
const filterPriceMaxValueIpnut = document.querySelector('.easy-basket-upper');
filterPriceInputsArray.push(crollLow, crollUp, filterPriceMinValueIpnut, filterPriceMaxValueIpnut)

const renderConfig ={
    priceParam: {
        min: +filterPriceMinValueIpnut.value,
        max: +filterPriceMaxValueIpnut.value
    },
    checkboxParam: {
        color: [],
        storage: [],
        category: [],
        display: []
    }
}


const filterRender = () =>{

    const filteringArray = ()=>{
        const arrayForRender = items.filter(el =>{
            let result;
            if(renderConfig.checkboxParam.color.length ||
                renderConfig.checkboxParam.storage.length ||
                renderConfig.checkboxParam.category.length ||
                renderConfig.checkboxParam.display.length
            ){
                for(let checkboxCategory of Object.keys(renderConfig.checkboxParam)){
                    const currentCategoryArray = renderConfig.checkboxParam[checkboxCategory];
                    if(currentCategoryArray.length){
                        for(let item of currentCategoryArray){
                            if(checkboxCategory == 'display'){
                                const displayParam = []

                                // take value for render from string
                                item.split(' ').forEach(elem=>{
                                    if(elem.match(/\d/)){
                                        displayParam.push(+elem)
                                    } 
                                })

                                // compare display param from items with checkbox value
                                if(displayParam.length>=2){
                                    if((el[checkboxCategory]>=displayParam[0] && el[checkboxCategory]<=displayParam[1])
                                    && (renderConfig.priceParam.min <= el.price && el.price <= renderConfig.priceParam.max )){
                                        result = true
                                    }
                                }else{
                                    if((el[checkboxCategory]>=displayParam[0])
                                    && (renderConfig.priceParam.min <= el.price && el.price <= renderConfig.priceParam.max )){
                                        result = true;
                                    }
                                }
                            }else{
                                if(((el[checkboxCategory]+"").includes(item)) 
                                && (renderConfig.priceParam.min <= el.price && el.price <= renderConfig.priceParam.max )){
                                    result = true;
                                }
                            }
                        }
                    }
                }
                return result
            }else{
                return renderConfig.priceParam.min <= el.price && el.price <= renderConfig.priceParam.max
            }
        })
        return arrayForRender
    }

    filterPriceInputsArray.forEach(el =>{
        el.addEventListener('input',e=>{
            if(  filterPriceMinValueIpnut.value.match(/^\d+$/) && filterPriceMaxValueIpnut.value.match(/^\d+$/) 
                || (filterPriceMinValueIpnut.value === "" || filterPriceMaxValueIpnut.value === "")){
                
                    renderConfig.priceParam.min = +filterPriceMinValueIpnut.value
                    renderConfig.priceParam.max = +filterPriceMaxValueIpnut.value
                
            } else{
                filterPriceMinValueIpnut.value = renderConfig.priceParam.min;
                filterPriceMaxValueIpnut.value = renderConfig.priceParam.max;
            }
            renderCards(filteringArray())

        })}
    );
    const f = document.querySelectorAll('.filter-param__input')

    f.forEach(el =>{
        const paramId = el.parentNode.parentNode.parentNode.id
        el.addEventListener('change', e=>{
            const value = e.target.parentNode.nextElementSibling.innerText
            if(e.target.checked){
                renderConfig.checkboxParam[paramId].push(value)
            }else{
                const currentElem = renderConfig.checkboxParam[paramId].find(el => el == value)
                const currentElemIndex = renderConfig.checkboxParam[paramId].indexOf(currentElem);
                renderConfig.checkboxParam[paramId].splice(currentElemIndex, 1)
            }
            renderCards(filteringArray())
        })
    })
}
filterRender()

// OPEN CART

const cartLogo = document.querySelector('.cart-logo')
const cart = document.querySelector('.cart')
cartLogo.addEventListener('click', e=>{
    if(cart.classList[1]=== 'disabled'){
        cart.setAttribute('class', 'cart')
    }else{
        cart.setAttribute('class', 'cart disabled')
    }
})

// ADD TO CART  /// DONE without local storage

const elemsInCart = []
const totalCartInfo = {
    totalAmount: 0,
    totalPrice: 0
}
const itemsWraper = document.querySelector('.items__wraper');
const cartLogoTotalAmount = document.querySelector('.cart-logo__total-amount');

// Render cart item and total info /// DONE
const renderCartItem = (device, amountOfItem)=>{
    const amount = amountOfItem;
    let classNameBtnLeft;
    let classNameBtnRight
    amount == 1?  classNameBtnLeft ='btn-left disabled' : classNameBtnLeft ='btn-left';
    amount == 4?  classNameBtnRight ='btn-right disabled' : classNameBtnRight ='btn-right';
    if(!elemsInCart.length){
        itemsWraper.innerHTML =`
        <div class="your-cart-is-ampty">
            <h2>Your cart is ampty...</h2>
        </div>
        `
    }else{
        const addwraper = cElem('div');
        addwraper.innerHTML =`
        <div class="cart-item" itemid="${device.id}">
            <div class="cart-item__img">
                <img src="img/${device.imgUrl}" alt="image">
            </div>
            <div class="cart-item__info">
                <p>${device.name}</p>
                <span>$${device.price*amount}</span>
            </div>
            <div class="cart-item__amount-controller">
                <button class="${classNameBtnLeft}">
                    <img src="img/icons/arrow_left.svg" alt="image">
                </button>
                <p>${amount}</p>
                <button class="${classNameBtnRight}">
                    <img src="img/icons/arrow_right.svg" alt="image">
                </button>
            </div>
            <div class="cart-item__close-btn">
                <button>
                    <img src="img/icons/close-cart.svg" alt="image">
                </button>
            </div>
    `
        itemsWraper.append(addwraper)       
    }
    console.log(elemsInCart)
    deleteItemFromCart()
    amountContolBtns()
    renderCartTotalInfo(totalCartInfo.totalAmount, totalCartInfo.totalPrice)
}

const renderCartTotalInfo =(totalAmount, totalPrice)=>{
    const cartTotalInfo = document.querySelector('.cart-items-total-info')
    cartTotalInfo.innerHTML=`
    <span>
        <p>Total amount:</p>
        <p>${totalAmount}</p>
        <p>ptc.</p>
    </span>
    <span>
        <p>Total price:</p>
        <p>${totalPrice}</p>
        <p>$</p>
    </span>
    `
}

//Main logic for "add to cart" /// DONE
const addToCart = (btn, device)=>{
    btn.addEventListener('click', event =>{
        let objInElemsInCart = elemsInCart.find(item=> item.device == device);
        if(!objInElemsInCart){
            elemsInCart.push({device: device, amount: 1})
            totalCartInfo.totalAmount++
            totalCartInfo.totalPrice += device.price
        }else{
            if(objInElemsInCart.amount<4){
                objInElemsInCart.amount++
                totalCartInfo.totalAmount++
                totalCartInfo.totalPrice += device.price
            }
        }
        cartLogoTotalAmount.innerText = totalCartInfo.totalAmount
        itemsWraper.innerHTML = ''
        event.stopPropagation();
        elemsInCart.forEach(el=>{
            renderCartItem(el.device, el.amount)
        })
        addKeyValueInLocalStorage('elemsInCart', elemsInCart)
        addKeyValueInLocalStorage('totalCartInfo', totalCartInfo)
    })
}

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
        textPR.innerText = '%  Positive reviews';
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
        
        showModal(card, device)
        addToCart(btnAddToCart, device)
        return card;
    };

const renderCards = list =>{
    const elems = list.map(item => renderCard(item));
    listContainer.clear().add(elems);
};

renderCards(items);




// Delete item from cart  /// DONE
const deleteItemFromCart =()=>{
    const deleteItemFromCartBtn = document.querySelectorAll('.cart-item__close-btn');
    deleteItemFromCartBtn.forEach(el=>{
        el.childNodes[1].addEventListener('click', e=>{
            const elemId = el.parentNode.attributes[1].value
            elemsInCart.forEach((elOfArray, index)=>{
                if(elOfArray.device.id == elemId){

                    let objInElemsInCart = elemsInCart.find(item=> item.device == elOfArray.device);
                    totalCartInfo.totalPrice -= objInElemsInCart.device.price*objInElemsInCart.amount
                    totalCartInfo.totalAmount -= objInElemsInCart.amount
                    cartLogoTotalAmount.innerText = totalCartInfo.totalAmount

                    elemsInCart.splice(index, 1);

                    itemsWraper.innerHTML = ''
                    elemsInCart.forEach(el=>{
                        renderCartItem(el.device, el.amount)
                    })
                    if(!elemsInCart.length){
                        renderCartItem()
                    }
                    addKeyValueInLocalStorage('elemsInCart', elemsInCart)
                    addKeyValueInLocalStorage('totalCartInfo', totalCartInfo)
                }
            })
           
        })
    })
}

// Change in cart amount of items with amount control btn   /// DONE

const amountContolBtns =()=>{
    const plusOne = document.querySelectorAll('.btn-right');
    const minusOne = document.querySelectorAll('.btn-left');
    plusOne.forEach(el=>{
        el.addEventListener('click', e=>{
            const elemId = el.parentNode.parentNode.attributes[1].value
            elemsInCart.forEach((elOfArray)=>{
                if(elOfArray.device.id == elemId){

                    let objInElemsInCart = elemsInCart.find(item=> item.device == elOfArray.device);
                        objInElemsInCart.amount++
                        totalCartInfo.totalAmount++
                        totalCartInfo.totalPrice += objInElemsInCart.device.price

                    itemsWraper.innerHTML = ''
                    elemsInCart.forEach(el=>{
                        renderCartItem(el.device, el.amount)
                    })
                    if(!elemsInCart.length){
                        renderCartItem()
                    }
                    renderCartTotalInfo(totalCartInfo.totalAmount, totalCartInfo.totalPrice)
                    addKeyValueInLocalStorage('elemsInCart', elemsInCart)
                    addKeyValueInLocalStorage('totalCartInfo', totalCartInfo)
                }
            })
        })
    })
    minusOne.forEach(el=>{
        el.addEventListener('click', e=>{
            const elemId = el.parentNode.parentNode.attributes[1].value
            elemsInCart.forEach((elOfArray)=>{
                if(elOfArray.device.id == elemId){

                    let objInElemsInCart = elemsInCart.find(item=> item.device == elOfArray.device);
                        objInElemsInCart.amount--
                        totalCartInfo.totalAmount--
                        totalCartInfo.totalPrice -= objInElemsInCart.device.price

                    itemsWraper.innerHTML = ''
                    elemsInCart.forEach(el=>{
                        renderCartItem(el.device, el.amount)
                    })
                    if(!elemsInCart.length){
                        renderCartItem()
                    }
                    renderCartTotalInfo(totalCartInfo.totalAmount, totalCartInfo.totalPrice)
                    addKeyValueInLocalStorage('elemsInCart', elemsInCart)
                    addKeyValueInLocalStorage('totalCartInfo', totalCartInfo)
                }
            })
        })
    })
}

renderCartItem();

// Local storage
const addKeyValueInLocalStorage = (key, value)=>{
    if(localStorage.getItem(key)){
        if(typeof value === String){
            localStorage[key] = value
        }
        if(typeof value === 'function')
        {
            return
        }else{
            localStorage[key] = JSON.stringify(value)
        }
    }else{
        if(typeof value === String){
            localStorage.setItem(key, value)
        }
        if(typeof value === 'function')
        {
            return
        }else{
            localStorage.setItem(key, JSON.stringify(value)) 
        }
    }
}

// Upload cart from local storage

// const takeKeyValueFromLocalStorage = (key)=>{
//     let ElemFromLocalStorage = JSON.parse(localStorage.getItem(key))
//     return ElemFromLocalStorage
// }

// takeKeyValueFromLocalStorage('elemsInCart').forEach(el=>{
//     renderCartItem(el.device, el.amount)
// })



