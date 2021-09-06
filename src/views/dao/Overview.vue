<template>
  <div class="container mb-2">
    <div class="row">
      <div class="col-4">
        <div class="card text-start w-auto p-2" style="width: 18rem">
          <div class="card-body">
            <h5 class="text-center">Můj podíl</h5>
              <h2>56 432 <small>POD</small> <span class="badge bg-info">≈ 6,43%</span></h2>
              <p>≈ <NumberFormatter :amount="null"/> Kč</p>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary"><i class="fas fa-shopping-cart"></i> Koupit</button>
                <button type="button" class="btn btn-warning"><i class="fas fa-money-bill-wave"></i> Prodat</button>
              </div>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row mt-2">
      <!-- Novy clen -->
      <div class="col-12">
        <section class="mb-4 text-start">
          <div class="card">
            <div class="card-body">
              <!--<span class="badge bg-primary mb-2">Probíhá hlasování</span>-->
              <MDBProgress :height="4">
                <MDBProgressBar :value="75" bg="primary" />
              </MDBProgress>
              <h5 class="card-title mt-1 mb-1">Nový člen rady</h5>
              <p>
                Hlasování o přijetí nového člena <strong>jirinovak.near</strong>
              </p>
              <ul class="list-unstyled text-muted">
                <li>
                  <strong>ANO</strong>
                  <MDBProgress :height="18">
                    <MDBProgressBar :value="30" bg="success"
                      >30%</MDBProgressBar
                    >
                  </MDBProgress>
                </li>
                <li>
                  <strong>NE</strong>
                  <MDBProgress :height="18">
                    <MDBProgressBar :value="15" bg="warning"
                      >15%</MDBProgressBar
                    >
                  </MDBProgress>
                </li>
                <li>&nbsp;</li>
                <li>
                  <i class="far fa-calendar fa-fw me-3 mb-3"></i> 15.9.2021
                  <span class="font-weight-bold">10:00</span>
                </li>
                <li>
                  <i class="fas fa-comments fa-fw me-3 mb-3"></i>
                  <a href="#!" target="_blank">Diskuse</a>
                </li>
                <li>
                  <span class="badge bg-info">Rada</span>
                  <span class="badge bg-info">Nový</span>
                </li>
              </ul>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary">
                  <i class="fas fa-check me-2"></i> ANO
                </button>
                <button type="button" class="btn btn-primary">
                  <i class="fas fa-times me-2"></i> NE
                </button>
                <button type="button" class="btn btn-dark">
                  <i class="fas fa-trash me-2"></i>SPAM
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- Proposal in progress -->
      <!-- Novy clen -->
      <div class="col-12">
        <section class="mb-4 text-start">
          <div class="card">
            <div class="card-body">
              <!--<span class="badge bg-primary mb-2">Probíhá hlasování</span>-->
              <MDBProgress :height="4">
                <MDBProgressBar :value="20" bg="primary" />
              </MDBProgress>
              <h5 class="card-title mt-1 mb-1">Uvolnění tokenů</h5>
              <p>Odemknutí tokenů ze skupiny <strong>volný prodej</strong></p>
              <ul class="list-unstyled text-muted">
                <li>
                  <strong>ANO - 10%</strong>
                  <MDBProgress :height="18">
                    <MDBProgressBar :value="60" bg="success"
                      >60%</MDBProgressBar
                    >
                  </MDBProgress>
                </li>
                <li>
                  <strong>ANO - 15%</strong>
                  <MDBProgress :height="18">
                    <MDBProgressBar :value="10" bg="success"
                      >10%</MDBProgressBar
                    >
                  </MDBProgress>
                </li>
                <li>
                  <strong>NE</strong>
                  <MDBProgress :height="18">
                    <MDBProgressBar :value="15" bg="warning"
                      >15%</MDBProgressBar
                    >
                  </MDBProgress>
                </li>
                <li>&nbsp;</li>
                <li>
                  <i class="far fa-calendar fa-fw me-3 mb-3"></i> 30.9.2021
                  <span class="font-weight-bold">10:00</span>
                </li>
                <li>
                  <i class="fas fa-comments fa-fw me-3 mb-3"></i>
                  <a href="#!" target="_blank">Diskuse</a>
                </li>
                <li>
                  <span class="badge bg-info">Rada</span>
                  <span class="badge bg-info">Nový</span>
                </li>
              </ul>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary">
                  <i class="fas fa-check me-2"></i> ANO - 10%
                </button>
                <button type="button" class="btn btn-primary">
                  <i class="fas fa-check me-2"></i> ANO - 15%
                </button>
                <button type="button" class="btn btn-primary">
                  <i class="fas fa-times me-2"></i> NE
                </button>
                <button type="button" class="btn btn-dark">
                  <i class="fas fa-trash me-2"></i>SPAM
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import NumberFormatter from "@/views/helpers/NumberFormatter.vue"
import { useI18n } from "vue-i18n";

export default {
  components: {
    MDBProgress, MDBProgressBar, NumberFormatter
  },
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