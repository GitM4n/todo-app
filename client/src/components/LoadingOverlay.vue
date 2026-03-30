<template>
  <div class="overlay d-flex justify-content-center align-items-center">
    <i class="bi bi-arrow-repeat spin"></i>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
  overflow: hidden;
}

.spin {
  animation: spin 1s linear infinite;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
  font-size: 5em;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
