<template>
  <!-- Order -->
  <!-- <div class="d-flex align-items-center mb-2">
    <hr class="flex-grow-1 my-0" />
    <p class="mb-0 px-2 small">Řadit podle:</p>
    <div class="dropdown">
      <a
        class="link-dark dropdown-toggle font-weight-bold small"
        href="#"
        role="button"
        id="dropdownMenuLink"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
      >
        Vytvořeno
      </a>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  </div>-->
  <!-- /Order -->
  <!-- Proposal in progress -->
  <div class="row">
    <!-- Novy clen -->
    <div class="col-md-6 mb-4 mb-md-0">
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
                  <MDBProgressBar :value="30" bg="success">30%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>
                <strong>NE</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="15" bg="warning">15%</MDBProgressBar>
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
    <div class="col-md-6 mb-4 mb-md-0">
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
                  <MDBProgressBar :value="60" bg="success">60%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>
                <strong>ANO - 15%</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="10" bg="success">10%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>
                <strong>NE</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="15" bg="warning">15%</MDBProgressBar>
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
    <!-- Novy clen -->
    <!-- SPAM -->
    <div class="col-md-6 mb-4 mb-md-0">
      <section class="mb-4 text-start">
        <div class="card">
          <div class="card-body">
            <!--<span class="badge bg-primary mb-2">Probíhá hlasování</span>-->
            <h5 class="card-title mt-1 mb-1">
              Vývoj pro facebook <span class="badge bg-dark mb-2">SPAM</span>
            </h5>
            <p>Externí zakázka od společnosti <strong>FaceBook</strong></p>
            <ul class="list-unstyled text-muted">
              <li>
                <strong>SPAM</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="100" bg="black">100%</MDBProgressBar>
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
          </div>
        </div>
      </section>
    </div>
    <!-- SPAM -->
    <!-- Success -->
    <div class="col-md-6 mb-4 mb-md-0">
      <section class="mb-4 text-start">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-1 mb-1">
              Přijetí investora
              <span class="badge bg-success mb-2">Schváleno</span>
            </h5>
            <p>
              Nový investor <strong>investor.near</strong> obdrží
              <strong>2&nbsp;000</strong> POD za <strong>25&nbsp;000</strong> Ⓝ
              do pokladny
            </p>
            <ul class="list-unstyled text-muted">
              <li>
                <strong>ANO</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="80" bg="success">80%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>
                <strong>NE</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="10" bg="warning">10%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>&nbsp;</li>
              <li>
                <i class="far fa-calendar fa-fw me-3 mb-3"></i> 25.8.2021
                <span class="font-weight-bold">10:00</span>
              </li>
              <li>
                <i class="fas fa-comments fa-fw me-3 mb-3"></i>
                <a href="#!" target="_blank">Diskuse</a>
              </li>
            </ul>
            <p>
              Značky:<br /><span class="badge bg-info">Investor</span>
              <span class="badge bg-info">Vývoj</span>
            </p>
          </div>
        </div>
      </section>
    </div>
    <!-- Success -->
    <!-- Failed -->
    <div class="col-md-6 mb-4 mb-md-0">
      <section class="mb-4 text-start">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-1 mb-1">
              Půjčka na DeFi
              <span class="badge bg-warning mb-2">Zamítnuto</span>
            </h5>
            <p>
              Zapůjčení <strong>4&nbsp;000</strong>Ⓝ z
              <strong>DeFi.app</strong> s úrokem <strong>10%</strong>
            </p>
            <ul class="list-unstyled text-muted">
              <li>
                <strong>ANO</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="0" bg="success">0%</MDBProgressBar>
                </MDBProgress>
              </li>
              <li>
                <strong>NE</strong>
                <MDBProgress :height="18">
                  <MDBProgressBar :value="100" bg="warning"
                    >100%</MDBProgressBar
                  >
                </MDBProgress>
              </li>
              <li>&nbsp;</li>
              <li>
                <i class="far fa-calendar fa-fw me-3 mb-3"></i> 25.8.2021
                <span class="font-weight-bold">10:00</span>
              </li>
              <li>
                <i class="fas fa-comments fa-fw me-3 mb-3"></i>
                <a href="#!" target="_blank">Diskuse</a>
              </li>
            </ul>
            <p>
              Značky:<br /><span class="badge bg-info">Půjčka</span>
              <span class="badge bg-info">DeFi</span>
            </p>
          </div>
        </div>
      </section>
    </div>
    <!-- Failed -->
  </div>
</template>

<script>
import { MDBProgress, MDBProgressBar } from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        MDBProgress, MDBProgressBar
    },
    props: {
      dao: {
        type: Object,
        required: true
      }
    },
    setup() {
        const { t } = useI18n()
        return { t };
    },
}
</script>