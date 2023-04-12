let productModal = null;
let deleteModal = null;

import pagePagination from './components/pagination.js';
import productComponent from './components/productComponent.js';
import deleteComponent from './components/deleteComponent.js';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      pages:{},
      isNew: false,
      addImg: false,
      newImg: "",
      selectProduct: {
        data: {
          title: "",
          category: "",
          origin_price: null,
          price: null,
          unit: "",
          description: "",
          content: "",
          is_enabled: 0,
          imageUrl: "",
          imagesUrl:[]
        },
      },
    };
  },
  components:{
    pagePagination,
    productComponent,
    deleteComponent,
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${apiUrl}v2/api/user/check`)
        .then(res=>{
          this.renderData();
        })
       .catch(err=>{
        alert(err.data.message)
       })
    },
    renderData(pages = 1) {
      axios
        .get(`${apiUrl}v2/api/${path}/admin/products/?page=${pages}`)
        .then(res=>{
          this.products = res.data.products;
          this.pages = res.data.pagination;
          this.clearProduct();
        })
       .catch(err=>{
        alert(err.data.message)
       })
    },
    openModal(status, product) {
      if(status === "new"){
        this.isNew = true;
        this.selectProduct.data= {
          imagesUrl:[],
        }
        productModal.show();
      }else if(status === "edit"){
        this.isNew = false;
        this.selectProduct.data = {...product};
        productModal.show();
      }else if(status === "delete"){
        this.selectProduct.data = {...product};
        deleteModal.show();
      }
    },
    updateProduct() {
      let url = `${apiUrl}v2/api/${path}/admin/product`
      let method = "post"
      const id = this.selectProduct.data.id;
      // 選擇編輯按鈕，api會用put
      if(!this.isNew){
        url = `${apiUrl}v2/api/${path}/admin/product/${id}`
        method = "put"
      }
      axios[method](url,this.selectProduct)
        .then(res=>{
          alert(res.data.message);
          productModal.hide();
          this.renderData();
        })
       .catch(err=>{
        alert(err.data.message)
       })
    },
    deleteProduct() {
      const id = this.selectProduct.data.id;
      axios
        .delete(`${apiUrl}v2/api/${path}/admin/product/${id}`)
        .then(res=>{
          alert(res.data.message)
          this.renderData();
          deleteModal.hide();
        })
       .catch(err=>{
        alert(err.data.message);
        deleteModal.hide();
       })
    },
    clearProduct() {
      this.isNew = false;
      this.selectProduct.data = {};
      this.clearImg();
    },
    addImgBtn(){
      this.addImg = true;
    },
    inputImgUrl(img){
      this.newImg = img;
    },
    addNewImg(img) {
      if(!this.selectProduct.data.hasOwnProperty('imagesUrl')){
        this.selectProduct.data.imagesUrl = [];
      }
      if(this.newImg.trim() === ""){
        return;
      }
      this.selectProduct.data.imagesUrl.push(this.newImg);
      this.clearImg();
    },
    deleteImg(key) {
      this.selectProduct.data.imagesUrl.splice(key,1)
    },
    clearImg() {
      this.newImg = "";
      this.addImg = false;
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    deleteModal = 
    new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  },
})

app.mount("#app");
