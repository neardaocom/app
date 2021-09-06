<template>
  <div class="container mb-2">
    <div class="card text-start">
      <div class="card-body">
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam
          bibendum elit eget erat. Nulla turpis magna, cursus sit amet, suscipit
          a, interdum id, felis. In rutrum. Nulla est. In enim a arcu imperdiet
          malesuada. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Aliquam id dolor. Ut
          enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Nullam
          lectus justo, vulputate eget mollis sed, tempor sed magna. Aliquam
          erat volutpat. Aliquam ornare wisi eu metus. Etiam posuere lacus quis
          dolor. Curabitur bibendum justo non orci. Integer malesuada.
        </p>
        <p>
          Proin mattis lacinia justo. Et harum quidem rerum facilis est et
          expedita distinctio. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos hymenaeos. Nulla est. Integer tempor.
          Cras elementum. Morbi scelerisque luctus velit. Lorem ipsum dolor sit
          amet, consectetuer adipiscing elit. Quisque tincidunt scelerisque
          libero. Nulla turpis magna, cursus sit amet, suscipit a, interdum id,
          felis. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
          reiciendis voluptatibus maiores alias consequatur aut perferendis
          doloribus asperiores repellat. Sed elit dui, pellentesque a, faucibus
          vel, interdum nec, diam.
        </p>
        <p>
          Nullam at arcu a est sollicitudin euismod. Mauris dictum facilisis
          augue. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin
          et, dolor. Sed vel lectus. Donec odio tempus molestie, porttitor ut,
          iaculis quis, sem. Maecenas sollicitudin. Praesent in mauris eu tortor
          porttitor accumsan. Et harum quidem rerum facilis est et expedita
          distinctio. Fusce aliquam vestibulum ipsum. Vivamus luctus egestas
          leo. Proin pede metus, vulputate nec, fermentum fringilla, vehicula
          vitae, justo. Vivamus luctus egestas leo. Duis viverra diam non justo.
          Fusce nibh.
        </p>
        <p>
          Morbi scelerisque luctus velit. Duis aute irure dolor in reprehenderit
          in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Aliquam erat volutpat. Duis condimentum augue id magna semper rutrum.
          Fusce suscipit libero eget elit. Praesent id justo in neque elementum
          ultrices. Mauris suscipit, ligula sit amet pharetra semper, nibh ante
          cursus purus, vel sagittis velit mauris vel metus. Suspendisse
          sagittis ultrices augue. Phasellus enim erat, vestibulum vel, aliquam
          a, posuere eu, velit. Etiam commodo dui eget wisi.
        </p>
        <p>
          Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu.
          Duis viverra diam non justo. Integer rutrum, orci vestibulum
          ullamcorper ultricies, lacus quam ultricies odio, vitae placerat pede
          sem sit amet enim. Aliquam ornare wisi eu metus. Ut enim ad minima
          veniam, quis nostrum exercitationem ullam corporis suscipit
          laboriosam, nisi ut aliquid ex ea commodi consequatur? Etiam dictum
          tincidunt diam. Nulla quis diam. Nunc auctor. Lorem ipsum dolor sit
          amet, consectetuer adipiscing elit. Cum sociis natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Aenean fermentum
          risus id tortor. Nullam rhoncus aliquam metus. Sed ut perspiciatis
          unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nam
          libero tempore, cum soluta nobis est eligendi optio cumque nihil
          impedit quo minus id quod maxime placeat facere possimus, omnis
          voluptas assumenda est, omnis dolor repellendus. In sem justo, commodo
          ut, suscipit at, pharetra vitae, orci. Praesent in mauris eu tortor
          porttitor accumsan. Curabitur ligula sapien, pulvinar a vestibulum
          quis, facilisis vel sapien. In rutrum. Etiam commodo dui eget wisi.
          Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et,
          dolor.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import { useI18n } from "vue-i18n";

export default {
  components: {},
  props: {
    dao: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>