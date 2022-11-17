<template>
    <b-card :title="title">
      <b-form-group description="Ingresa tu usuario" label="Usuario:" label-for="username">
        <b-form-input id="username" v-model="entity.username" trim />
      </b-form-group>
      <b-form-group description="Ingresa tu contraseña" label="Contraseña:" label-for="password">
        <b-form-input id="password" v-model="entity.password" trim />
      </b-form-group>
      <template #footer>
        <b-container fluid>
          <b-row>
            <b-col class="text-center">
              <b-button variant="primary" @click="login">Ingresar</b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-card>
  </template>
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { UserService } from '../service/userService';
  import { User } from '../entity/user';
  import { useRoute } from 'vue-router';
  import Swal from 'sweetalert2';
  import { ENTITY, swal, detailImage, tableImage, loadImage } from '../entity/utils';
  
  export default defineComponent({
    props: ['title'],
    data() {
      return {
        detailImage,
        entity: new User(),
        userService: new UserService(),
        ENTITY
      };
    },
    methods: {
      loadImage: (n: string, e: string) => loadImage(n, e, useRoute()),
      login() {
          this.userService.login(this.entity)
            .then(result => {
              this.entity = result;
            }).catch(err => Swal.fire(swal(err)));
      },
    }
  });
  </script>