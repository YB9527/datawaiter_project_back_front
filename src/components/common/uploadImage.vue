<template>
  <div >
    <el-upload
      action="#"
      :file-list="elupload.filelist"
      :limit="elupload.limit"
      :auto-upload="elupload.autoupload"
      :list-type="elupload.listtype"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange">
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="dialogVisible"  append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: "uploadImage",
    props: {
      elupload: {
        ok: () => {

        }
      }
    },
    data() {
      let defaultvalue = {
          limit:1,
          autoupload:false,
          listtype:'picture-card',
          filelist:[],
      };
      if(!this.elupload.limit){
        this.elupload.limit = defaultvalue.limit;
      }
      if(!this.elupload.autoupload){
        this.elupload.autoupload = defaultvalue.autoupload;
      }
      if(!this.elupload.listtype){
        this.elupload.listtype = defaultvalue.listtype;
      }
      if(!this.elupload.filelist){
        this.elupload.filelist = defaultvalue.filelist;
      }
      let filelist =this.elupload.filelist;
      this.elupload.saveAndDelete = this.saveAndDelete;
      return {
        dialogVisible: false,
        dialogImageUrl: "",
        filelist,
        deleteimageValue:[],
        addimageValue:[],
      }
    },
    created(){
      this.init();

    },
    methods: {
      init(){
        this.clearImage();
        this.findImage();
      },
      clearImage(){
        let filelist = this.filelist;
        if(filelist.length > 0){
          filelist.splice(0,filelist.length);
        }
        let addimageValue = this.addimageValue;
        if(addimageValue.length > 0){
          addimageValue.splice(0,addimageValue.length);
        }
        let deleteimageValue = this.deleteimageValue;
        if(deleteimageValue.length > 0){
          deleteimageValue.splice(0,deleteimageValue.length);
        }
      },
      async findImage(){
          let fjArray = await this.$FjApi.findImageByObjectidAndCustomname(this.elupload.objectid,this.elupload.customname);
          for (let fj of fjArray){
            fj.url  =  this.$Api.imgpriewurl+fj.path;
            this.filelist.push(fj);
          }
         // console.log(333,fjArray)
      },
      onChange(file, fileList){
        if(file.status === "ready"){
          this.addimageValue.push(file);
        }
      },
      handleRemove(file) {
        if(file.status === "success"){
          this.deleteimageValue.push(file);
        }else  if(file.status === "ready"){
          for (let i = 0; i < this.addimageValue.length; i++) {
            if(this.addimageValue[i].id  === file.id){
              this.addimageValue.splice(i,1);
            }
          }
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      },
      async saveAndDelete() {
        if(this.addimageValue.length > 0){
          //this.$FjApi.uploadFile(this.addimageValue[0].raw,{extendname:"AAA.png"});

          let files = [];
          for (let file of  this.addimageValue) {
            files.push(file.raw);
          }
          let  fjArray = this.elupload.getFJArray(this.addimageValue);
          fjArray = await this.$FjApi.uploadFileArray(files,fjArray);
          this.$FjApi.setURL(fjArray);

        }
        if(this.deleteimageValue.length > 0){
          await this.$FjApi.deleteFJ(this.deleteimageValue);
        }
        this.init();
        //console.log("addimageValue",this.addimageValue);
        //console.log("deleteimageValue",this.deleteimageValue);

      },
    }
  }
</script>


