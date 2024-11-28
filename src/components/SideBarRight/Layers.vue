<script setup lang='ts'>
</script>

<template>
  <div class="layers block">
    <h2 class="trn" data-trn-key="图层">图层</h2>
    <div class="content" id="layers_base">
      <button type="button" class="layer_add" id="insert_layer" title="Insert new layer">+</button>
      <button type="button" class="layer_duplicate" id="delete_layer" title="Duplicate layer">D</button>
      <button type="button" class="layer_raster" id="layer_raster" title="Convert layer to raster">R</button>
      <button type="button" class="layers_arrow" title="Move layer down" id="layer_down">↓</button>
      <button type="button" class="layers_arrow" title="Move layer up" id="layer_up">↑</button>


      <div class="layers_list" id="layers">
        <div class="item  active">
          <button class="visibility visible" id="visibility" data-id="28" title="Hide"></button>	
          <button class="delete" id="delete" data-id="28" title="Delete"></button>	
          <button class="layer_name" id="layer_name" data-id="28"></button>	
          <div class="clear"></div>
        </div>
      
      </div>
  </div>
  </div>
</template>

<style lang='scss' scoped>
</style>