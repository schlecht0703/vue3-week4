export default{
    props:['selectProduct','clearProduct','isNew','deleteImg','addImg','newImg','clearImg','addNewImg','updateProduct'],
    emits:['addImg','addNewImg','newImg','inputImg'],
    data(){
      return{
        uploadImg:false,
        uploadImgUrl:"",
      }
    },
    methods:{
      inputImg(e){
        let imgUrl = e.target.value;
        this.$emit('inputImg',imgUrl);
      },
      clearUploadImg(){
        this.uploadImgUrl = "";
        this.$refs.fileInput.value = '';
      },
      uploadNewImg(){
        const file = this.$refs.fileInput.files[0];
        const formData = new FormData();
        formData.append('file-to-upload',file)
        axios
        .post(`${apiUrl}v2/api/${path}/admin/upload`,formData)
        .then(res=>{
          this.uploadImgUrl = res.data.imageUrl;
        })
       .catch(err=>{
        alert(err.data.message)
       })
      },
      pushUploadImg(){
        this.selectProduct.data.imagesUrl.push(this.uploadImgUrl);
        this.clearUploadImg();
      }
    },
    template:`
    <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header text-white" :class="{'bg-warning':isNew,'bg-info':!isNew}" >
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isNew">新增產品</span>
          <span v-else>修改產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click.prevent="clearProduct"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-2">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">主要圖片</label>
                <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="selectProduct.data.imageUrl">
              </div>
              <img class="img-fluid" v-if="selectProduct.data.imageUrl" :src="selectProduct.data.imageUrl" alt="img">
            </div>
            <div>
              <h5>其他圖片</h5>
              <div v-for="(image,key) in selectProduct.data.imagesUrl" :key="'image'+key">
                <div class="mb-3 d-flex flex-column align-items-end">
                     <img class="img-fluid mb-3" :src="image" alt="img">
 <button class="btn btn-outline-danger btn-sm d-block w-50" :data-key="key" @click="deleteImg(key)">
                刪除
              </button>
                </div>
              </div>
              <div v-if="addImg" class="mb-3">
                 <label for="image" class="form-label">圖片網址</label>
      <input type="text" class="form-control" placeholder="請輸入圖片連結" @input="inputImg">
                  <img class="img-fluid" v-if="newImg" :src="newImg" alt="img">
              </div>
              <button type="button" class="btn btn-outline-primary btn-sm d-block w-100 mb-2" @click="$emit('addImg')" v-if="!addImg">
                新增圖片
              </button>
              <div v-if="addImg" class="d-flex mb-2">
                <button type="button" class="btn btn-outline-secondary btn-sm d-block w-50 me-2" @click="clearImg">
                取消
              </button>
               <button type="button" class="btn btn-outline-primary btn-sm d-block w-50" @click="$emit('addNewImg')">
                確認
              </button>
              </div>
              <div v-if="uploadImg" class="mb-3">
              <label for="image" class="form-label">上傳圖片</label>
   <input type="text" class="form-control" @input="inputImg">
               <img class="img-fluid" v-if="newImg" :src="newImg" alt="img">
           </div>
           <img class="img-fluid" v-if="uploadImgUrl" :src="uploadImgUrl" alt="img">
              <input type="file" class="form-control btn btn-outline-primary" id="file" placeholder="上傳圖片" v-if="!uploadImg" @change="uploadNewImg" ref="fileInput">
              <div v-if="uploadImgUrl" class="d-flex mb-2">
              <button type="button" class="btn btn-outline-secondary btn-sm d-block w-50 me-2" @click="clearUploadImg">
              取消
            </button>
             <button type="button" class="btn btn-outline-primary btn-sm d-block w-50" @click="pushUploadImg">
              確認
            </button>
            </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="selectProduct.data.title">
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input id="category" type="text" class="form-control" placeholder="請輸入分類" v-model="selectProduct.data.category">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="selectProduct.data.unit">
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="selectProduct.data.origin_price">
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價" v-model.number="selectProduct.data.price">
              </div>
            </div>

            <div class="row">
            <div class="mb-3 col-md-6">
              <label for="area" class="form-label">地區</label>
              <input id="area" type="text" class="form-control" placeholder="請輸入地區" v-model="selectProduct.data.area">
            </div>
            <div class="mb-3 col-md-6">
              <label for="address" class="form-label">使用地點</label>
              <input id="address" type="text" class="form-control" placeholder="請輸入兌換地點" v-model="selectProduct.data.address">
            </div>
          </div>
            <hr>
            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述" v-model="selectProduct.data.description">
                    </textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容" v-model="selectProduct.data.content">
                    </textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0" v-model="selectProduct.data.is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="clearProduct">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click.prevent="updateProduct">
          確認
        </button>
      </div>
    </div>
  </div>
    `
}