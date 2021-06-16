<template>
    <section>
        <div id="intro" class="bg-image" style="
            background-image: url('https://mdbootstrap.com/img/Photos/Others/images/62.jpg');
            height: 100vh;
        ">
        <div class="mask">
            <div class="container d-flex justify-content-center align-items-center h-100">
            <div class="row align-items-center">
                <div class="col-md-6 my-5">
                <h1 class="mb-5" style="color: #112f6b;">DAO's organisation agency</h1>
                <router-link :to="{name: 'dao', query: {}}" :class="['btn', 'btn-light', 'btn-rounded', 'btn-lg', 'me-1']">Launch DAO</router-link>
                <a href="#services" class="btn btn-danger btn-rounded btn-lg ms-1">
                    Learn more
                </a>
                </div>
                <div class="col-md-6">
                <img src="https://mdbootstrap.com/img/Mockups/Transparent/Small/admin-new.png" alt=""
                    class="img-fluid" />
                </div>
            </div>
            </div>
        </div>
        </div>
    </section>
</template>

<script>
export default {

}
</script>