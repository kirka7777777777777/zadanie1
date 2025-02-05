
let eventBus = new Vue()
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
            <product-tabs :reviewText="reviewText"></product-tabs>
            <div>
<!--    <product-review></product-review>-->
    <div>
</div>

            
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

            reviewText: [],
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
        mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
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
        sale() {
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
    props: {
      details: {
          type: Array,
          required: true
      }
    },
    template: `
           <div>
           <h2>Details:</h2>
           <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
</div>
            
 `, data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],

        }
    }

})


Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">

<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

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
 <label for="recommendation">Would ypu recommend this product?</label>
 <input type="radio" id="yes" value="yes" v-model="recommendation">
 <label for="yes">Yes</label>
 <input type="radio" id="no" value="no" v-model="recommendation">
  <label for="no">No</label>
  </p>  
 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            reviewText: null,
            review: [],
            rating: null,
            errors: [],
            recommendation: null,

        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommendation) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation
                };
                eventBus.$emit('review-submitted', productReview);
                this.resetForm();
            } else {
                this.errors.push(...[
                    !this.name && "Name required.",
                    !this.review && "Review required.",
                    !this.rating && "Rating required.",
                    !this.recommendation && "Recommendation required."
                ].filter(Boolean));
            }
        },
        resetForm() {
            this.name = '';
            this.review = '';
            this.rating = null;
            this.recommendation = '';
        }
    }

})
Vue.component('product-tabs', {
    props: {
        reviewText: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
   <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Review'">          
         <p v-if="!reviewText.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviewText">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">   
       <product-review></product-review>
</div>
<div v-show="selectedTab === 'Shipping'">
<p>shipping: {{ shipping }}</p> 
</div>
<div v-show="selectedTab === 'Details'">
<li v-for="detail in details">{{ detail }}</li>
<ul>
<li v-for="detail in details" :key="details">{{detail}}</li>
</ul>
</div>
     </div>

 `,
    data() {
        return {
            tabs: ['Review', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Review',
            premium: true


        }
    },
    methods : {
        switchToReviews() {
            this.selectedTab = 'Reviews';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    }
})




let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        reviewText: []
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

            this.reviewText.push(productReview)
            console.log(productReview)
        }

    }
})