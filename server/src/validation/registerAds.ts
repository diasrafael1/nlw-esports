import * as yup from "yup";
import { pt } from "yup-locales";

yup.setLocale(pt);

export const registerAds = yup.object().shape({
  name: yup.string().required("Informe o nome do usúario!"),
  discord: yup.string().required("Informe o discord do usuário!"),
  yearsPlaying: yup.number().required("Informe quantos anos o usuário joga!"),
  weekDays: yup
    .array()
    .required("Informe os dias da semana que o usúario joga!"),
  hourStart: yup.string().required("Informe o horário de ínicio!"),
  hourEnd: yup.string().required("Informe o horário de termino!"),
  useVoiceChannel: yup
    .boolean()
    .required("Informe se usa canal de voz ou não!"),
});
