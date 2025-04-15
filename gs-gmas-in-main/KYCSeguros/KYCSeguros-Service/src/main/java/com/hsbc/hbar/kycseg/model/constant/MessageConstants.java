/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.constant;

public class MessageConstants {
	// Tipos de datos mensajes
	public static final String MSG_TYPE_STRING = "S";
	public static final String MSG_TYPE_NUMERIC = "N";
	public static final String MSG_TYPE_DECIMAL = "D";
	public static final String MSG_TYPE_DATE = "F";

	// Mensaje Paises (1004)
	// Mensaje
	public static final String MSG_PAIS_MessageID = "1004";
	// Request
	// Response
	public static final Integer MSG_RES_PAIS_INI = 66;
	public static final Integer MSG_RES_PAIS_cantPais = 2;
	public static final Integer MSG_RES_PAIS_paisList = 99;
	public static final Integer MSG_RES_PAIS_paisCod = 2;
	public static final Integer MSG_RES_PAIS_paisNom = 40;

	// Mensaje Actividades AFIP (1114)
	// Mensaje
	public static final String MSG_ACTIV_MessageID = "1114";
	// Request
	public static final Integer MSG_REQ_ACTIV_actividadNom = 180;
	public static final Integer MSG_REQ_ACTIV_actividadCod = 6;
	public static final Integer MSG_REQ_ACTIV_actividadOtr = 180;
	// Response
	public static final Integer MSG_RES_ACTIV_INI = 432;
	public static final Integer MSG_RES_ACTIV_cantAct = 3;
	public static final Integer MSG_RES_ACTIV_actividadList = 170;
	public static final Integer MSG_RES_ACTIV_actividadCod = 6;
	public static final Integer MSG_RES_ACTIV_actividadNom = 180;

	// Mensaje KYC Get (1190)
	// Mensaje
	public static final String MSG_KYCG_MessageID = "1190";
	// Request
	public static final Integer MSG_REQ_KYCG_numeroCUIL = 11;
	public static final Integer MSG_REQ_KYCG_apellido = 40;
	public static final Integer MSG_REQ_KYCG_nombre = 30;
	public static final Integer MSG_REQ_KYCG_nroLlamada = 1;
	// Response
	public static final Integer MSG_RES_KYCG_INI = 148;
	public static final Integer MSG_RES_KYCG_primaAnualenAIS = 15;
	public static final Integer MSG_RES_KYCG_primaAnualenAIS_DEC = 2;
	public static final Integer MSG_RES_KYCG_esSCCenAIS = 1;
	public static final Integer MSG_RES_KYCG_esPEPenAIS = 1;
	public static final Integer MSG_RES_KYCG_perfilObligenAIS = 1;
	public static final Integer MSG_RES_KYCG_tipoOperacion = 1;
	public static final Integer MSG_RES_KYCG_vigenciaDesde = 8;
	public static final Integer MSG_RES_KYCG_vigenciaHasta = 8;
	public static final Integer MSG_RES_KYCG_estadoCod = 1;
	public static final Integer MSG_RES_KYCG_estadoDes = 20;
	public static final Integer MSG_RES_KYCG_tipoPersona = 1;
	public static final Integer MSG_RES_KYCG_tipoDoc = 2;
	public static final Integer MSG_RES_KYCG_tipoDocDes = 20;
	public static final Integer MSG_RES_KYCG_numeroDoc = 11;
	public static final Integer MSG_RES_KYCG_apellido = 40;
	public static final Integer MSG_RES_KYCG_nombre = 30;
	public static final Integer MSG_RES_KYCG_nacionalidad = 2;
	// fechaConstitucion valido para PJ - para PF es la fecha de nacimiento
	public static final Integer MSG_RES_KYCG_fechaConstitucion = 8; // PPCR_2015-00142_(ENS)
	public static final Integer MSG_RES_KYCG_dirCalle = 40;
	public static final Integer MSG_RES_KYCG_dirNumero = 5;
	public static final Integer MSG_RES_KYCG_dirPiso = 4;
	public static final Integer MSG_RES_KYCG_dirDepto = 4;
	public static final Integer MSG_RES_KYCG_dirLocalidad = 40;
	public static final Integer MSG_RES_KYCG_dirProvincia = 2;
	public static final Integer MSG_RES_KYCG_dirCodigoPostal = 5;
	public static final Integer MSG_RES_KYCG_telefono = 30;
	public static final Integer MSG_RES_KYCG_email = 50;
	public static final Integer MSG_RES_KYCG_titMpgTipoDoc = 2;
	public static final Integer MSG_RES_KYCG_titMpgNumeroDoc = 11;
	public static final Integer MSG_RES_KYCG_titMpgApellido = 40;
	public static final Integer MSG_RES_KYCG_titMpgNombre = 30;
	public static final Integer MSG_RES_KYCG_titMpgMedioPago = 100;
	public static final Integer MSG_RES_KYCG_actividadCod = 6;
	public static final Integer MSG_RES_KYCG_actividadNom = 180;
	public static final Integer MSG_RES_KYCG_caracterCod = 2;
	public static final Integer MSG_RES_KYCG_cliRegOrganismo = 1;
	public static final Integer MSG_RES_KYCG_esSCC = 1;
	public static final Integer MSG_RES_KYCG_esPEP = 1;
	public static final Integer MSG_RES_KYCG_esClienteBco = 1;
	public static final Integer MSG_RES_KYCG_cotizaBolsa = 1;
	public static final Integer MSG_RES_KYCG_subsCiaCotizaBolsa = 1;
	public static final Integer MSG_RES_KYCG_condicionIVA = 1;
	public static final Integer MSG_RES_KYCG_categoriaMono = 1;
	public static final Integer MSG_RES_KYCG_ingFecha = 8;
	public static final Integer MSG_RES_KYCG_condicionLab = 1;
	public static final Integer MSG_RES_KYCG_ingImporte1 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte1_DEC = 2;
	public static final Integer MSG_RES_KYCG_ingImporte2 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte2_DEC = 2;
	public static final Integer MSG_RES_KYCG_ingImporte3 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte3_DEC = 2;
	public static final Integer MSG_RES_KYCG_ingImporte4 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte4_DEC = 2;
	public static final Integer MSG_RES_KYCG_ingImporte5 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte5_DEC = 2;
	public static final Integer MSG_RES_KYCG_ingImporte6 = 15;
	public static final Integer MSG_RES_KYCG_ingImporte6_DEC = 2;
	public static final Integer MSG_RES_KYCG_fechaEstContables = 8;
	public static final Integer MSG_RES_KYCG_auditor = 100;
	public static final Integer MSG_RES_KYCG_tieneRelHSBC = 1;
	public static final Integer MSG_RES_KYCG_inicioAnn = 4;
	public static final Integer MSG_RES_KYCG_primaAnual = 15;
	public static final Integer MSG_RES_KYCG_primaAnual_DEC = 2;
	public static final Integer MSG_RES_KYCG_ultFecha = 8;
	public static final Integer MSG_RES_KYCG_actividadDes = 1500;
	public static final Integer MSG_RES_KYCG_propositoDes = 2000;
	public static final Integer MSG_RES_KYCG_motivoSCC = 500;
	public static final Integer MSG_RES_KYCG_docResDetalle = 2000;
	public static final Integer MSG_RES_KYCG_relDetalle = 500;
	public static final Integer MSG_RES_KYCG_valorOperarMot = 1500;
	public static final Integer MSG_RES_KYCG_perfilComentarios = 2000;
	public static final Integer MSG_RES_KYCG_observaciones = 2000;
	public static final Integer MSG_RES_KYCG_accionistas = 1000;
	public static final Integer MSG_RES_KYCG_caracterDes = 500;
	public static final Integer MSG_RES_KYCG_supComentario = 2000;
	public static final Integer MSG_RES_KYCG_comComentario = 2000;
	public static final Integer MSG_RES_KYCG_tieneRepSCC = 1;
	// _________________Representantes
	public static final Integer MSG_RES_KYCG_cantRep = 2;
	public static final Integer MSG_RES_KYCG_representanteList = 10;
	public static final Integer MSG_RES_KYCG_RepTipoDoc = 2;
	public static final Integer MSG_RES_KYCG_RepNumeroDoc = 11;
	public static final Integer MSG_RES_KYCG_RepApellido = 40;
	public static final Integer MSG_RES_KYCG_RepNombre = 30;
	public static final Integer MSG_RES_KYCG_RepCargo = 30;
	public static final Integer MSG_RES_KYCG_RepEsSCC = 1;
	public static final Integer MSG_RES_KYCG_RepEsPEP = 1;
	public static final Integer MSG_RES_KYCG_RepFechaNac = 8;
	// _________________Operaciones inusuales
	public static final Integer MSG_RES_KYCG_cantOIn = 2;
	public static final Integer MSG_RES_KYCG_opeInusualList = 10;
	public static final Integer MSG_RES_KYCG_OInSecuencia = 3;
	public static final Integer MSG_RES_KYCG_OInFecha = 8;
	public static final Integer MSG_RES_KYCG_OInTipoOperacion = 50;
	public static final Integer MSG_RES_KYCG_OInOrigenFondos = 50;
	public static final Integer MSG_RES_KYCG_OInMonto = 15;
	public static final Integer MSG_RES_KYCG_OInMonto_DEC = 2;
	public static final Integer MSG_RES_KYCG_OInObservacion = 60;
	// _________________Companias
	public static final Integer MSG_RES_KYCG_cantCia = 2;
	public static final Integer MSG_RES_KYCG_companiaList = 10;
	public static final Integer MSG_RES_KYCG_CiaCompania = 70;
	public static final Integer MSG_RES_KYCG_CiaEsSCC = 1;
	public static final Integer MSG_RES_KYCG_CiaFechaCons = 8;
	// _________________
	public static final Integer MSG_RES_KYCG_opePeopleSoft = 15;
	public static final Integer MSG_RES_KYCG_opeLName = 40;
	public static final Integer MSG_RES_KYCG_opeFName = 40;
	public static final Integer MSG_RES_KYCG_opeFechaUpd = 8;
	public static final Integer MSG_RES_KYCG_supPeopleSoft = 15;
	public static final Integer MSG_RES_KYCG_supLName = 40;
	public static final Integer MSG_RES_KYCG_supFName = 40;
	public static final Integer MSG_RES_KYCG_supFechaUpd = 8;
	public static final Integer MSG_RES_KYCG_comPeopleSoft = 15;
	public static final Integer MSG_RES_KYCG_comLName = 40;
	public static final Integer MSG_RES_KYCG_comFName = 40;
	public static final Integer MSG_RES_KYCG_comFechaUpd = 8;

	// Mensaje KYC Set (1191)
	// Mensaje
	public static final String MSG_KYCS_MessageID = "1191";
	// Request
	public static final Integer MSG_REQ_KYCS_numeroCUIL = 11;
	public static final Integer MSG_REQ_KYCS_tipoOperacion = 1;
	public static final Integer MSG_REQ_KYCS_vigenciaDesde = 8;
	public static final Integer MSG_REQ_KYCS_vigenciaHasta = 8;
	public static final Integer MSG_REQ_KYCS_estadoCod = 1;
	public static final Integer MSG_REQ_KYCS_perfilObligenAIS = 1;
	public static final Integer MSG_REQ_KYCS_opePeopleSoft = 15;
	public static final Integer MSG_REQ_KYCS_opeLName = 40;
	public static final Integer MSG_REQ_KYCS_opeFName = 40;
	public static final Integer MSG_REQ_KYCS_supPeopleSoft = 15;
	public static final Integer MSG_REQ_KYCS_supLName = 40;
	public static final Integer MSG_REQ_KYCS_supFName = 40;
	public static final Integer MSG_REQ_KYCS_tipoPersona = 1;
	public static final Integer MSG_REQ_KYCS_tipoDoc = 2;
	public static final Integer MSG_REQ_KYCS_numeroDoc = 11;
	public static final Integer MSG_REQ_KYCS_apellido = 40;
	public static final Integer MSG_REQ_KYCS_nombre = 30;
	public static final Integer MSG_REQ_KYCS_nacionalidad = 2;
	public static final Integer MSG_REQ_KYCS_fechaConstitucion = 8;
	public static final Integer MSG_REQ_KYCS_dirCalle = 40;
	public static final Integer MSG_REQ_KYCS_dirNumero = 5;
	public static final Integer MSG_REQ_KYCS_dirPiso = 4;
	public static final Integer MSG_REQ_KYCS_dirDepto = 4;
	public static final Integer MSG_REQ_KYCS_dirLocalidad = 40;
	public static final Integer MSG_REQ_KYCS_dirProvincia = 2;
	public static final Integer MSG_REQ_KYCS_dirCodigoPostal = 5;
	public static final Integer MSG_REQ_KYCS_telefono = 30;
	public static final Integer MSG_REQ_KYCS_email = 50;
	public static final Integer MSG_REQ_KYCS_titMpgTipoDoc = 2;
	public static final Integer MSG_REQ_KYCS_titMpgNumeroDoc = 11;
	public static final Integer MSG_REQ_KYCS_titMpgApellido = 40;
	public static final Integer MSG_REQ_KYCS_titMpgNombre = 30;
	public static final Integer MSG_REQ_KYCS_titMpgMedioPago = 100;
	public static final Integer MSG_REQ_KYCS_actividadCod = 6;
	public static final Integer MSG_REQ_KYCS_caracterCod = 2;
	public static final Integer MSG_REQ_KYCS_cliRegOrganismo = 1;
	public static final Integer MSG_REQ_KYCS_esSCC = 1;
	public static final Integer MSG_REQ_KYCS_esPEP = 1;
	public static final Integer MSG_REQ_KYCS_esClienteBco = 1;
	public static final Integer MSG_REQ_KYCS_cotizaBolsa = 1;
	public static final Integer MSG_REQ_KYCS_subsCiaCotizaBolsa = 1;
	public static final Integer MSG_REQ_KYCS_condicionIVA = 1;
	public static final Integer MSG_REQ_KYCS_categoriaMono = 1;
	public static final Integer MSG_REQ_KYCS_ingFecha = 8;
	public static final Integer MSG_REQ_KYCS_condicionLab = 1;
	public static final Integer MSG_REQ_KYCS_ingImporte1 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte1_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ingImporte2 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte2_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ingImporte3 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte3_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ingImporte4 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte4_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ingImporte5 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte5_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ingImporte6 = 15;
	public static final Integer MSG_REQ_KYCS_ingImporte6_DEC = 2;
	public static final Integer MSG_REQ_KYCS_fechaEstContables = 8;
	public static final Integer MSG_REQ_KYCS_auditor = 100;
	public static final Integer MSG_REQ_KYCS_inicioAnn = 4;
	public static final Integer MSG_REQ_KYCS_primaAnual = 15;
	public static final Integer MSG_REQ_KYCS_primaAnual_DEC = 2;
	public static final Integer MSG_REQ_KYCS_ultFecha = 8;
	public static final Integer MSG_REQ_KYCS_actividadDes = 1500;
	public static final Integer MSG_REQ_KYCS_propositoDes = 2000;
	public static final Integer MSG_REQ_KYCS_motivoSCC = 500;
	public static final Integer MSG_REQ_KYCS_docResDetalle = 2000;
	public static final Integer MSG_REQ_KYCS_relDetalle = 500;
	public static final Integer MSG_REQ_KYCS_valorOperarMot = 1500;
	public static final Integer MSG_REQ_KYCS_perfilComentarios = 2000;
	public static final Integer MSG_REQ_KYCS_perfilComentarios_Filler = 1;
	public static final Integer MSG_REQ_KYCS_observaciones = 2000;
	public static final Integer MSG_REQ_KYCS_accionistas = 1000;
	public static final Integer MSG_REQ_KYCS_caracterDes = 500;
	// _________________Representantes
	public static final Integer MSG_REQ_KYCS_representanteList = 10;
	public static final Integer MSG_REQ_KYCS_RepTipoDoc = 2;
	public static final Integer MSG_REQ_KYCS_RepNumeroDoc = 11;
	public static final Integer MSG_REQ_KYCS_RepApellido = 40;
	public static final Integer MSG_REQ_KYCS_RepNombre = 30;
	public static final Integer MSG_REQ_KYCS_RepCargo = 30;
	public static final Integer MSG_REQ_KYCS_RepEsSCC = 1;
	public static final Integer MSG_REQ_KYCS_RepEsPEP = 1;
	public static final Integer MSG_REQ_KYCS_RepFechaNac = 8;
	// _________________Operaciones inusuales
	public static final Integer MSG_REQ_KYCS_opeInusualList = 10;
	public static final Integer MSG_REQ_KYCS_OInFecha = 8;
	public static final Integer MSG_REQ_KYCS_OInTipoOperacion = 50;
	public static final Integer MSG_REQ_KYCS_OInOrigenFondos = 50;
	public static final Integer MSG_REQ_KYCS_OInMonto = 15;
	public static final Integer MSG_REQ_KYCS_OInMonto_DEC = 2;
	public static final Integer MSG_REQ_KYCS_OInObservacion = 60;
	// _________________Companias
	public static final Integer MSG_REQ_KYCS_companiaList = 10;
	public static final Integer MSG_REQ_KYCS_CiaCompania = 70;
	public static final Integer MSG_REQ_KYCS_CiaEsSCC = 1;
	public static final Integer MSG_REQ_KYCS_CiaFechaCons = 8;
	public static final Integer MSG_REQ_KYCS_Fin = 1;
	// Response
	public static final Integer MSG_RES_KYCS_INI = 18345;
	public static final Integer MSG_RES_KYCS_estadoGra = 1;
	public static final Integer MSG_RES_KYCS_estadoAsi = 1;
	public static final Integer MSG_RES_KYCS_estadoCod = 1;
	public static final Integer MSG_RES_KYCS_estadoDes = 20;

	// Mensaje KYC List (1192)
	// Mensaje
	public static final String MSG_KYCL_MessageID = "1192";
	// Request
	public static final Integer MSG_REQ_KYCL_profileKey = 10;
	public static final Integer MSG_REQ_KYCL_peopleSoft = 15;
	public static final Integer MSG_REQ_KYCL_estado1 = 1;
	public static final Integer MSG_REQ_KYCL_estado2 = 1;
	public static final Integer MSG_REQ_KYCL_estado3 = 1;
	public static final Integer MSG_REQ_KYCL_estado4 = 1;
	public static final Integer MSG_REQ_KYCL_estado5 = 1;
	// Response
	public static final Integer MSG_RES_KYCL_INI = 96;
	public static final Integer MSG_RES_KYCL_canKYC = 3;
	public static final Integer MSG_RES_KYCL_kycList = 100;
	public static final Integer MSG_RES_KYCL_tipoPersona = 1;
	public static final Integer MSG_RES_KYCL_ultFecha = 8;
	public static final Integer MSG_RES_KYCL_numeroCUIL = 11;
	public static final Integer MSG_RES_KYCL_apellido = 40;
	public static final Integer MSG_RES_KYCL_nombre = 30;
	public static final Integer MSG_RES_KYCL_estadoCod = 1;
	public static final Integer MSG_RES_KYCL_estadoDes = 20;
	public static final Integer MSG_RES_KYCL_peopleSoft = 15;
	public static final Integer MSG_RES_KYCL_lName = 40;
	public static final Integer MSG_RES_KYCL_fName = 40;
	public static final Integer MSG_RES_KYCL_primaAnual = 15;
	public static final Integer MSG_RES_KYCL_primaAnual_DEC = 2;
	public static final Integer MSG_RES_KYCL_categCliente = 4; // PPCR_2015-00142_(ENS)
	public static final Integer MSG_RES_KYCL_descCategCli = 40; // PPCR_2015-00142_(ENS)

	// Mensaje KYC Upd (1193)
	// Mensaje
	public static final String MSG_KYCU_MessageID = "1193";
	// Request
	public static final Integer MSG_REQ_KYCU_numeroCUIL = 11;
	public static final Integer MSG_REQ_KYCU_tipoOperacion = 1;
	public static final Integer MSG_REQ_KYCU_estadoCod = 1;
	public static final Integer MSG_REQ_KYCU_profileKey = 10;
	public static final Integer MSG_REQ_KYCU_peopleSoft = 15;
	public static final Integer MSG_REQ_KYCU_lName = 40;
	public static final Integer MSG_REQ_KYCU_fName = 40;
	public static final Integer MSG_REQ_KYCU_categCli = 4; // PPCR_2015-00142_(ENS)
	public static final Integer MSG_REQ_KYCU_categCGS = 5; // PPCR_2015-00142_(ENS)
	public static final Integer MSG_REQ_KYCU_comentario = 2000;
	// Response
	public static final Integer MSG_RES_KYCU_INI = 2193;
	public static final Integer MSG_RES_KYCU_estadoGra = 1;
	public static final Integer MSG_RES_KYCU_estadoAsi = 1;
	public static final Integer MSG_RES_KYCU_estadoCod = 1;
	public static final Integer MSG_RES_KYCU_estadoDes = 20;

	// Mensaje KYC Lista Categorias GS (1194) // PPCR_2015-00142_(ENS)
	// Mensaje
	public static final String MSG_CATEGGS_MessageID = "1194";
	// Request
	public static final Integer MSG_REQ_CATEGGS_categCliAIS = 4;
	// Response
	public static final Integer MSG_RES_CATEGGS_INI = 70;
	public static final Integer MSG_RES_CATEGGS_canKYCC = 3;
	public static final Integer MSG_REQ_CATEGGS_categCliGS = 5;
	public static final Integer MSG_REQ_CATEGGS_descCategCliGS = 150;
}
