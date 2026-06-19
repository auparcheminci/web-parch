<script lang="ts">
  import { Authenticator } from "@aws-amplify/ui-svelte";
  import type { AuthUser } from "@aws-amplify/auth";
  import type { AuthMachineState } from "@aws-amplify/ui";
  import "./auth.scss";
</script>

<div id="home-container" class="flex flex-1 overflow-hidden">
  <div id="home-col-left" class="flex-1 py-5 pl-5 pr-2.5 overflow-hidden">
    <img
      src="https://strapi-z4iu.onrender.com/uploads/1000x1000_100_5cbae1b054.jpg"
      alt="placeholder"
      class="object-cover w-full h-full rounded-2xl"
    />
  </div>
  <div id="home-col-right" class="flex-1 py-5 pl-2.5 pr-5 overflow-hidden">
    <div
      id="auth-container"
      class="relative w-full h-full flex items-center justify-center"
    >
      <a
        id="auth-back-btn"
        href="https://www.auparchemin.ci/"
        class="absolute top-0 left-0 p-2.5 rounded-br-xl"
        aria-label="Retour au site"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span class="auth-back-label">Retour au site</span>
      </a>
      <div id="auth-form-wrapper" class="flex flex-col w-full max-w-md">
        <div id="auth-header" class="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="201.422"
            height="125.999"
            viewBox="0 0 201.422 125.999"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                y1="0.858"
                x2="1"
                y2="0.858"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stop-color="#3496a8" />
                <stop offset="0.18" stop-color="#7f4c99" />
                <stop offset="0.39" stop-color="#db3938" />
                <stop offset="0.59" stop-color="#e1823a" />
                <stop offset="0.81" stop-color="#30a636" />
                <stop offset="1" stop-color="#f1c139" />
              </linearGradient>
            </defs>
            <g id="Logo" transform="translate(-1389 -127.911)">
              <g
                id="Logo_Couleur"
                data-name="Logo Couleur"
                transform="translate(1489.711 181.88)"
              >
                <g
                  id="Group_702"
                  data-name="Group 702"
                  transform="translate(-100.711 -53.968)"
                >
                  <path
                    id="Path_1124"
                    data-name="Path 1124"
                    d="M75.357,53.726v24.54H21.644V24.554h56.7V21.57H18.66V81.251H78.341V53.741Z"
                    transform="translate(7.855 9.08)"
                    fill="#868686"
                  />
                  <path
                    id="Path_1125"
                    data-name="Path 1125"
                    d="M189.307,0S76.98,32.455,43.871,83.283c0,0-2.458,4.021-3.6-.355-.753-2.785-1.52-5.556-2.274-8.341-1.62-5.854-3.254-11.709-4.945-17.549q-1.194-4.135-2.444-8.256c-.853-2.785-2.472-5.769-1.634-8.753A2.618,2.618,0,0,1,30.457,38.2c3.4-1.307,4.632,2.615,5.755,4.973,1.734,3.609,3.2,7.318,4.618,11.069q2.43,6.458,4.277,13.144S95.978,13.655,189.321,0Z"
                    transform="translate(12.101)"
                    fill="url(#linear-gradient)"
                  />
                  <g
                    id="Group_701"
                    data-name="Group 701"
                    transform="translate(0 98.7)"
                  >
                    <path
                      id="Path_1126"
                      data-name="Path 1126"
                      d="M9.648,78.479H7.2l-.568-1.435H2.941l-.554,1.435H0L3.751,69.57h2.06l3.851,8.909ZM4.732,71.957q-.043.213-.085.384a3.089,3.089,0,0,1-.1.341q-.064.17-.128.384c-.057.142-.114.313-.2.512l-.583,1.634H5.883L5.258,73.52c-.085-.2-.142-.355-.2-.5a3.635,3.635,0,0,0-.128-.369c-.043-.114-.071-.227-.1-.327s-.057-.227-.085-.369H4.732Z"
                      transform="translate(0 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1127"
                      data-name="Path 1127"
                      d="M7.87,69.56h2.259v5.684a3.247,3.247,0,0,0,.043.512,1.117,1.117,0,0,0,.5.725,1.838,1.838,0,0,0,1.052.284,2.49,2.49,0,0,0,.611-.071,1.481,1.481,0,0,0,.426-.185,1.024,1.024,0,0,0,.27-.284,1.214,1.214,0,0,0,.128-.341,4.478,4.478,0,0,0,.057-.554c0-.242.014-.526.014-.853v-4.9h2.259v4.675c0,.526,0,.952-.028,1.307a5.106,5.106,0,0,1-.114.9,2.6,2.6,0,0,1-.227.639,5.249,5.249,0,0,1-.369.54,3.7,3.7,0,0,1-.512.426,3.362,3.362,0,0,1-.639.327,4.219,4.219,0,0,1-.81.2,7.012,7.012,0,0,1-1.009.071,6.582,6.582,0,0,1-1.62-.171,3.529,3.529,0,0,1-1.094-.469,2.484,2.484,0,0,1-.668-.668,2.957,2.957,0,0,1-.355-.782,6.752,6.752,0,0,1-.128-.952c-.028-.384-.043-.8-.043-1.265V69.56Z"
                      transform="translate(3.313 -69.418)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1128"
                      data-name="Path 1128"
                      d="M18.56,78.479V69.57H21.7c.554,0,1.023,0,1.421.028a3.658,3.658,0,0,1,1.037.185,3.1,3.1,0,0,1,.71.384,2.536,2.536,0,0,1,.909,1.293,2.723,2.723,0,0,1,.128.838,3.28,3.28,0,0,1-.2,1.165,2.6,2.6,0,0,1-.512.838,2.849,2.849,0,0,1-.7.554,2.807,2.807,0,0,1-.767.284,5.957,5.957,0,0,1-.824.1c-.313.014-.682.028-1.094.028h-.966v3.226H18.588Zm2.259-7.119v2.089H21.6a4.468,4.468,0,0,0,1.35-.128,1.114,1.114,0,0,0,.469-.369.948.948,0,0,0,.171-.554.977.977,0,0,0-.242-.654,1.031,1.031,0,0,0-.611-.327q-.149-.021-.469-.043c-.213-.014-.469-.014-.782-.014Z"
                      transform="translate(7.813 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1129"
                      data-name="Path 1129"
                      d="M33.228,78.479H30.784l-.568-1.435H26.521l-.554,1.435H23.58l3.751-8.909h2.06l3.851,8.909Zm-4.917-6.522q-.043.213-.085.384a3.089,3.089,0,0,1-.1.341q-.064.17-.128.384c-.057.142-.114.313-.2.512l-.583,1.634h2.245l-.625-1.691c-.085-.2-.142-.355-.2-.5a3.639,3.639,0,0,0-.128-.369c-.043-.114-.071-.227-.1-.327s-.057-.227-.085-.369h-.014Z"
                      transform="translate(9.926 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1130"
                      data-name="Path 1130"
                      d="M31.49,78.479V69.57h4.05a11.209,11.209,0,0,1,1.293.057,3.887,3.887,0,0,1,.924.2,1.74,1.74,0,0,1,.639.355,3.481,3.481,0,0,1,.483.526,2.469,2.469,0,0,1,.313.682,2.705,2.705,0,0,1,.1.767,3.154,3.154,0,0,1-.085.725,1.792,1.792,0,0,1-.327.711,2.37,2.37,0,0,1-.668.625,4.087,4.087,0,0,1-1.137.469v.028a2.681,2.681,0,0,1,.838.554,6.1,6.1,0,0,1,.81.995l1.464,2.217H37.5l-1.279-1.947a8.469,8.469,0,0,0-.725-.966,2.331,2.331,0,0,0-.526-.469,1.439,1.439,0,0,0-.213-.1,1.067,1.067,0,0,0-.227-.057c-.085,0-.171-.028-.284-.028h-.5v3.567Zm3.382-5.314h.9a4.628,4.628,0,0,0,.54-.043.779.779,0,0,0,.512-.3.908.908,0,0,0,.156-.554.8.8,0,0,0-.739-.838c-.085,0-.242-.014-.455-.028H33.749v1.776h1.123Z"
                      transform="translate(13.256 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1131"
                      data-name="Path 1131"
                      d="M46.763,75.6a4.3,4.3,0,0,1-1.449,2.316,4.156,4.156,0,0,1-2.544.753,4.611,4.611,0,0,1-1.748-.313,3.9,3.9,0,0,1-1.364-.909,4.1,4.1,0,0,1-.9-1.435,5.2,5.2,0,0,1-.313-1.876,5.624,5.624,0,0,1,.313-1.961,4.291,4.291,0,0,1,.9-1.478,3.738,3.738,0,0,1,1.393-.924,4.912,4.912,0,0,1,1.8-.313,4.193,4.193,0,0,1,2.472.7,3.607,3.607,0,0,1,1.393,2.131l-2.274.355a1.822,1.822,0,0,0-.639-1.023,1.8,1.8,0,0,0-1.052-.3,2.108,2.108,0,0,0-.81.142,1.438,1.438,0,0,0-.639.455,2.138,2.138,0,0,0-.412.824,5.265,5.265,0,0,0-.142,1.265,5.689,5.689,0,0,0,.142,1.321,2.59,2.59,0,0,0,.412.867,1.55,1.55,0,0,0,.625.469,2.062,2.062,0,0,0,.782.142,1.528,1.528,0,0,0,1.066-.4,2.616,2.616,0,0,0,.71-1.25l2.245.426Z"
                      transform="translate(16.186 -69.46)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1132"
                      data-name="Path 1132"
                      d="M45.8,78.479V69.57h2.259v3.353h3.268V69.57h2.259v8.909H51.328V74.742H48.059v3.737Z"
                      transform="translate(19.28 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1133"
                      data-name="Path 1133"
                      d="M53.24,78.479V69.57h7.119v1.819H55.5V72.9h4.519v1.833H55.5v1.933h5.03v1.819Z"
                      transform="translate(22.412 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1134"
                      data-name="Path 1134"
                      d="M64.918,75.727c.014-.142.043-.27.057-.384s.043-.242.071-.369.057-.256.1-.4.085-.313.142-.511l1.435-4.5h3.155v8.909H67.831V72.032H67.8l-2,6.437H64.022L62,72.032h-.028v6.437H59.93V69.56h3.155l1.464,4.533c.057.185.1.355.128.5s.071.27.1.4.043.242.071.355.043.242.071.369h.043Z"
                      transform="translate(25.229 -69.418)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1135"
                      data-name="Path 1135"
                      d="M68.88,78.479V69.57h2.259v8.909Z"
                      transform="translate(28.996 -69.414)"
                      fill="#1f3c82"
                    />
                    <path
                      id="Path_1136"
                      data-name="Path 1136"
                      d="M72.43,78.479V69.57h2.131l3.453,5.442h.028V69.57h2.131v8.909H78l-3.41-5.357h-.028v5.357Z"
                      transform="translate(30.491 -69.414)"
                      fill="#1f3c82"
                    />
                  </g>
                </g>
              </g>
              <text
                id="Extranet"
                transform="translate(1441 251.91)"
                fill="#203c81"
                font-size="10"
                font-family="Lato-Light, Lato"
                font-weight="300"
                ><tspan x="-24.792" y="0">EXTRANET</tspan></text
              >
            </g>
          </svg>
          <p class="text-sm text-center text-gray-500">
            Pour accéder à la plateforme, saisissez votre identifiant et votre
            mot de passe dans les champs ci-dessous. Si vous ne possédez pas
            encore de compte, vous pouvez en créer un en cliquant sur “Créer mon
            compte”.
          </p>
        </div>
        <Authenticator
          formFields={{
            signIn: {
              username: {
                label: "",
                placeholder: "Email",
              },
              password: {
                label: "",
                placeholder: "Mot de passe",
              },
            },
          }}
        >
          {#snippet children({
            signOut,
            user,
          }: {
            signOut: () => void;
            user: AuthUser;
            state: AuthMachineState;
            send: unknown;
          })}
            <main>
              <p>Welcome, Welcome {user?.signInDetails?.loginId}</p>
              <button onclick={signOut}>Sign out</button>
            </main>
          {/snippet}
        </Authenticator>
      </div>
    </div>
  </div>
</div>
