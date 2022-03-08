<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import uploadExts from "@/config/upload-ext";

const props = defineProps({
  ext: {
    type: [String, Array],
    default() {
      return uploadExts;
    },
  },
  size: {
    type: [String, Number],
    default: 2,
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const imageUrl = ref("");

const beforeUpload = (file) => {
  const fileType = file.type.substr(file.type.lastIndexOf("/") + 1);

  let extValidate = false;
  if (typeof props.ext === "string") {
    extValidate = fileType === props.ext;
  } else if (Array.isArray(props.ext)) {
    extValidate = props.ext.includes(fileType);
  }

  if (!extValidate) {
    ElMessage.error("文件格式不正确");
    return;
  }

  const sizeValidate = file.size / 1024 / 1024 < props.size;
  if (!sizeValidate) {
    ElMessage.error(`文件不能超过${props.size}M`);
    return;
  }

  return true;
};

const handleChange = (file) => {
  imageUrl.value = URL.createObjectURL(file.raw);
};

const emits = defineEmits(["update:modelValue"]);
const handleUpload = () => {
  setTimeout(() => {
    // 01~10
    const num = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    const fileName = `/avatar/avatar${String(num).padStart(2, "0")}.png`;
    emits("update:modelValue", fileName);
    ElMessage.success("上传成功");
  }, 1000);
};

const handleSuccess = (res, file) => {
  console.log(res, file);
  imageUrl.value = URL.createObjectURL(file.raw);
};
</script>

<template>
  <el-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-change="handleChange"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="image" />
    <el-icon v-else class="uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<style scoped lang="scss">
:deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #409eff;
  }
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
