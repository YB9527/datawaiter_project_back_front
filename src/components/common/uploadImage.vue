<template>
  <div>
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
      this.clearImage();
      this.findImage();
    },
    methods: {
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
      findImage(){
          
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
      saveAndDelete() {
        console.log("addimageValue",this.addimageValue);
        console.log("deleteimageValue",this.deleteimageValue);
      },

    }

  }
</script>


