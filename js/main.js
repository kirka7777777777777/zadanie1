

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a :href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{outOfStock: !inStock}">Out of stock</p>
            <span v-if="onSale">On Sale</span>
            <p>{{ sale }}</p>
            <product-details></product-details>
            <p>Shipping: {{ shipping }}</p> 
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
            <div v-for="size in sizes" @click="selectSize(size)">
                <p>{{ size }}</p>
            </div>
            
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="removeFromCart">Remove from cart</button>
            <div>
    <product-review @review-submitted="addReview"></product-review>
            
        </div>
        </div>  
 `, data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: " A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    methods: {
        updateCart() {
            this.cart += 1;
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeFromCart() {
            this.$emit('remove-from-cart')
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        selectSize(size) {
            console.log(`Size selected: ${size}`);
        },
        updateRemoveFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() { // Новое вычисляемое свойство
            return this.onSale
                ? `${this.brand} ${this.product} сейчас на распродаже!`
                : `К сожалению, сейчас нет распродажи на ${this.brand} ${this.product}.`;
        },
        shipping() {
            console.log(this.premium)
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    }
})



Vue.component('product-details', {
    template: `
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
 `, data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }

})


Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
    
   <div>
<h2>Reviews</h2>
<p v-if="!reviews.length">There are no reviews yet.</p>
<ul>
  <li v-for="review in reviews">
  <p>{{ review.name }}</p>
  <p>Rating: {{ review.rating }}</p>
  <p>{{ review.review }}</p>
  </li>
</ul>
</div>

 `,
    data() {
        return {
            name: null,
            reviews: [],
            rating: null
        }
    },
    methods:{
        onSubmit() {
            let productReview = {
                name: this.name,
                reviews: this.reviews,
                rating: this.rating
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.reviews = null
            this.rating = null
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }

    }

})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        // reviews: [],
    },
    methods: {
        updateCart(id) {

            this.cart.push(id);
            console.log(this.cart)
        },
        updateRemoveFromCart(id) {
            if (this.cart.length > 0) {
                 this.cart.pop(id);
            }
        },
        addReview(productReview) {

            this.reviews.push(productReview)
        }

    }
})






//
//
//     data: {
//         product: "Socks",
//         brand: 'Vue Mastery',
//         description: " A pair of warm, fuzzy socks",
//         selectedVariant: 0,
//         altText: "A pair of socks",
//         link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
//         inStock: true,
//         inventory: 100,
//         onSale: true,
//         details: ['80% cotton', '20% polyester', 'Gender-neutral'],
//         variants: [
//             {
//                 variantId: 2234,
//                 variantColor: 'green',
//                 variantImage: "./assets/vmSocks-green-onWhite.jpg",
//                 variantQuantity: 10,
//             },
//             {
//                 variantId: 2235,
//                 variantColor: 'blue',
//                 variantImage: "./assets/vmSocks-blue-onWhite.jpg",
//                 variantQuantity: 0,
//             }
//         ],
//         sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
//         cart: 0,
//
//
//     },
//     methods: {
//         addToCart() {
//             this.cart += 1
//         },
//         updateProduct(index) {
//             this.selectedVariant = index;
//             console.log(index);
//         },
//         removeFromCart() {
//             if (this.cart > 0) {
//                 this.cart -= 1
//             }
//         },
//         selectSize(size) {
//             console.log(`Size selected: ${size}`);
//         }
//     },
//     computed: {
//         title() {
//             return this.brand + ' ' + this.product;
//         },
//         image() {
//             return this.variants[this.selectedVariant].variantImage;
//         },
//         inStock(){
//             return this.variants[this.selectedVariant].variantQuantity
//         },
//         sale() { // Новое вычисляемое свойство
//             return this.onSale
//                 ? `${this.brand} ${this.product} сейчас на распродаже!`
//                 : `К сожалению, сейчас нет распродажи на ${this.brand} ${this.product}.`;
//         },
//     }
// })


