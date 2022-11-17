<template>
  <b-card :title="title">
    <b-form-group description="Ingresa tu usuario" label="Usuario:" label-for="username">
      <b-form-input id="username" v-model="entity.username" trim />
    </b-form-group>
    <b-form-group description="Ingresa tu contraseña" label="Contraseña:" label-for="password">
      <b-form-input id="password" type="password" v-model="entity.password" trim />
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
import { UserService } from '../../service/userService';
import { User } from '../../entity/user';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { ENTITY, swal } from '../../entity/utils';

export default defineComponent({
  props: ['title'],
  data() {
    return {
      entity: new User(),
      userService: new UserService(),
      ENTITY
    };
  },
  methods: {
    goHome() {
      this.$router.push('/home');
    },
    login() {
      this.userService.login(this.entity)
        .then(result => {
          this.entity = result;
          sessionStorage.setItem('user', JSON.stringify(result));
        }).catch(err => Swal.fire(swal(err)).then(this.goHome));
    },
  }
});
</script>