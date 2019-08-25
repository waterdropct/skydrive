<template>
    <div class="noPage">
        404 NotFound <a href="/cloud">Back to Index</a>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
    props: {},
    methods: {}
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
    .noPage{
      width: 100%;
      text-align: center;
      margin-top: 300px;
    }
    .noPage a{
      color: #409eff;
      text-decoration: none;
    }
  </style>
  