/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.constant;

public final class MessageConstants {
	private MessageConstants() {
		throw new IllegalAccessError("Constant class");
	}

	// Tipos de datos mensajes
	public static final String MSG_TYPE_STRING = "S";
	public static final String MSG_TYPE_NUMERIC = "N";
	public static final String MSG_TYPE_DECIMAL = "D";
	public static final String MSG_TYPE_DATE = "F";

	// Mensaje OpeEmitidas List (1109)
	// Mensaje
	public static final String MSG_COEL_MESSAGEID = "1109";
	// Request
	public static final Integer MSG_REQ_COEL_COMPANIA = 4;
	public static final Integer MSG_REQ_COEL_PRODUCTO = 10;
	public static final Integer MSG_REQ_COEL_FECHADESDE = 8;
	public static final Integer MSG_REQ_COEL_FECHAHASTA = 8;
	public static final Integer MSG_REQ_COEL_PARAMSTART = 58;
	// Response
	public static final Integer MSG_RES_COEL_INI = 96;
	public static final Integer MSG_RES_COEL_CANTREG = 3;
	public static final Integer MSG_RES_COEL_COELIST = 180;
	public static final Integer MSG_RES_COEL_COMPANIA = 4;
	public static final Integer MSG_RES_COEL_POLIZA = 40;
	public static final Integer MSG_RES_COEL_ENDOSO = 6;
	public static final Integer MSG_RES_COEL_TOMADOR = 30;
	public static final Integer MSG_RES_COEL_VIGENCIADESDE = 8;
	public static final Integer MSG_RES_COEL_VIGENCIAHASTA = 8;
	public static final Integer MSG_RES_COEL_FECHAEMISION = 8;
	public static final Integer MSG_RES_COEL_PRIMA_SIG = 1;
	public static final Integer MSG_RES_COEL_PRIMA = 15;
	public static final Integer MSG_RES_COEL_PRIMA_DEC = 2;
	public static final Integer MSG_RES_COEL_PRECIO_SIG = 1;
	public static final Integer MSG_RES_COEL_PRECIO = 15;
	public static final Integer MSG_RES_COEL_PRECIO_DEC = 2;
	public static final Integer MSG_RES_COEL_MOTIVO = 20;
	public static final Integer MSG_RES_COEL_PRODUCTO = 20;

	// Mensaje Cliente List (1010)
	// Mensaje
	public static final String MSG_CCLL_MESSAGEID = "1010";
	// Request
	public static final Integer MSG_REQ_CCLL_TIPOBUSQUEDA = 1;
	public static final Integer MSG_REQ_CCLL_TIPDOC = 2;
	public static final Integer MSG_REQ_CCLL_NRODOC = 11;
	public static final Integer MSG_REQ_CCLL_APELLIDO = 20;
	public static final Integer MSG_REQ_CCLL_COMPANIA = 4;
	public static final Integer MSG_REQ_CCLL_POLIZA = 40;
	public static final Integer MSG_REQ_CCLL_PARAMSTART = 58;
	// Response
	public static final Integer MSG_RES_CCLL_INI = 144;
	public static final Integer MSG_RES_CCLL_CANTREG = 3;
	public static final Integer MSG_RES_CCLL_CCLLIST = 270;
	public static final Integer MSG_RES_CCLL_COMPANIA = 4;
	public static final Integer MSG_RES_CCLL_POLIZA = 40;
	public static final Integer MSG_RES_CCLL_ENDOSO = 6;
	public static final Integer MSG_RES_CCLL_TOMADOR = 30;
	public static final Integer MSG_RES_CCLL_ESTADO = 10;
	public static final Integer MSG_RES_CCLL_PRODUCTO = 20;

	// Mensaje Cliente (1102)
	// Mensaje
	public static final String MSG_CCLI_MESSAGEID = "1102";
	// Request
	public static final Integer MSG_REQ_CCLI_COMPANIA = 4;
	public static final Integer MSG_REQ_CCLI_POLIZA = 40;
	// Response
	public static final Integer MSG_RES_CCLI_INI = 52;
	public static final Integer MSG_RES_CCLI_TOMADOR = 30;
	public static final Integer MSG_RES_CCLI_TIPDOC = 15;
	public static final Integer MSG_RES_CCLI_NRODOC = 11;
	public static final Integer MSG_RES_CCLI_SEXO = 1;
	public static final Integer MSG_RES_CCLI_FECHANACIMIENTO = 8;
	public static final Integer MSG_RES_CCLI_NACIONALIDAD = 40;
	public static final Integer MSG_RES_CCLI_ESTADOCIVIL = 15;
	public static final Integer MSG_RES_CCLI_DOMICILIO = 60;
	public static final Integer MSG_RES_CCLI_CODPOST = 8;
	public static final Integer MSG_RES_CCLI_LOCALIDAD = 40;
	public static final Integer MSG_RES_CCLI_PROVINCIA = 20;
	public static final Integer MSG_RES_CCLI_CANTCONT = 3;
	public static final Integer MSG_RES_CCLI_CONTLIST = 50;
	public static final Integer MSG_RES_CCLI_CONTMEDIO = 25;
	public static final Integer MSG_RES_CCLI_CONTDESCRIPCION = 50;

	// Mensaje Detalle de la Poliza (1101)
	// Mensaje
	public static final String MSG_CPOL_MESSAGEID = "1101";
	// Request
	public static final Integer MSG_REQ_CPOL_COMPANIA = 4;
	public static final Integer MSG_REQ_CPOL_POLIZA = 40;
	public static final Integer MSG_REQ_CPOL_ENDOSO = 6;
	// Response
	public static final Integer MSG_RES_CPOL_INI = 58;
	public static final Integer MSG_RES_CPOL_PRODUCTO = 10;
	public static final Integer MSG_RES_CPOL_SUCURSAL = 10;
	public static final Integer MSG_RES_CPOL_CANAL = 10;
	public static final Integer MSG_RES_CPOL_TOMADOR = 30;
	public static final Integer MSG_RES_CPOL_TIPDOC = 15;
	public static final Integer MSG_RES_CPOL_TIPDOCCOD = 2;
	public static final Integer MSG_RES_CPOL_NRODOC = 11;
	public static final Integer MSG_RES_CPOL_FECHAEMISION = 8;
	public static final Integer MSG_RES_CPOL_ESTADO = 10;
	public static final Integer MSG_RES_CPOL_VENDEDORLEGAJO = 10;
	public static final Integer MSG_RES_CPOL_VENDEDORNOMBRE = 70;
	public static final Integer MSG_RES_CPOL_PREMIO = 15;
	public static final Integer MSG_RES_CPOL_PREMIO_DEC = 2;
	public static final Integer MSG_RES_CPOL_VIGENCIADESDE = 8;
	public static final Integer MSG_RES_CPOL_VIGENCIAHASTA = 8;
	public static final Integer MSG_RES_CPOL_FECHAREGISTRACION = 8;
	public static final Integer MSG_RES_CPOL_ORDEN = 10;
	public static final Integer MSG_RES_CPOL_CANALCOBRO = 20;
	public static final Integer MSG_RES_CPOL_TIPCTA = 15;
	public static final Integer MSG_RES_CPOL_NROCTA = 25;
	public static final Integer MSG_RES_CPOL_CAMPANA = 50;
	public static final Integer MSG_RES_CPOL_CANTASEG = 2;
	public static final Integer MSG_RES_CPOL_ASEGLIST = 1;
	public static final Integer MSG_RES_CPOL_ASEGNOMBRE = 70;
	public static final Integer MSG_RES_CPOL_ASEGTIPDOC = 15;
	public static final Integer MSG_RES_CPOL_ASEGNRODOC = 11;
	public static final Integer MSG_RES_CPOL_ASEGDOMICILIO = 60;
	public static final Integer MSG_RES_CPOL_ASEGCODPOST = 8;
	public static final Integer MSG_RES_CPOL_ASEGLOCALIDAD = 40;
	public static final Integer MSG_RES_CPOL_ASEGPROVINCIA = 20;
	public static final Integer MSG_RES_CPOL_CANTASEGADIC = 2;
	public static final Integer MSG_RES_CPOL_ASEGADICLIST = 10;
	public static final Integer MSG_RES_CPOL_ASEGADICNOMBRE = 70;
	public static final Integer MSG_RES_CPOL_ASEGADICTIPDOC = 15;
	public static final Integer MSG_RES_CPOL_ASEGADICNRODOC = 11;
	public static final Integer MSG_RES_CPOL_LEYEBENEF = 60;
	public static final Integer MSG_RES_CPOL_CANTBENEF = 2;
	public static final Integer MSG_RES_CPOL_BENEFLIST = 10;
	public static final Integer MSG_RES_CPOL_BENEFORDEN = 2;
	public static final Integer MSG_RES_CPOL_BENEFNOMBRE = 70;
	public static final Integer MSG_RES_CPOL_BENEFTIPDOC = 15;
	public static final Integer MSG_RES_CPOL_BENEFNRODOC = 11;
	public static final Integer MSG_RES_CPOL_BENEFPORC = 5;
	public static final Integer MSG_RES_CPOL_BENEFPORC_DEC = 2;
	public static final Integer MSG_RES_CPOL_CANTCOB = 2;
	public static final Integer MSG_RES_CPOL_COBLIST = 20;
	public static final Integer MSG_RES_CPOL_COBDESCRIPCION = 60;
	public static final Integer MSG_RES_CPOL_COBSUMAASEG = 13;
	public static final Integer MSG_RES_CPOL_COBSUMAASEG_DEC = 2;
	public static final Integer MSG_RES_CPOL_CANTRIES = 2;
	public static final Integer MSG_RES_CPOL_RIESLIST = 50;
	public static final Integer MSG_RES_CPOL_RIESDESCRIPCION = 30;
	public static final Integer MSG_RES_CPOL_RIESCONTENIDO = 70;

	// Mensaje Productos por cia. (1103)
	// Mensaje
	public static final String MSG_PPRD_MESSAGEID = "1103";
	// Request
	public static final Integer MSG_REQ_PPRD_COMPANIA = 4;
	// Response
	public static final Integer MSG_RES_PPRD_INI = 12;
	public static final Integer MSG_RES_PPRD_CANTPROD = 3;
	public static final Integer MSG_RES_PPRD_PRODLIST = 300;
	public static final Integer MSG_RES_PPRD_PRODCODIGO = 10;
	public static final Integer MSG_RES_PPRD_PRODDESCRICOMPLETA = 60;
	public static final Integer MSG_RES_PPRD_PRODDESCRIPCION = 20;

	// Mensaje Sucursales por cia. (1104)
	// Mensaje
	public static final String MSG_PSUC_MESSAGEID = "1104";
	// Request
	public static final Integer MSG_REQ_PSUC_COMPANIA = 4;
	// Response
	public static final Integer MSG_RES_PSUC_INI = 12;
	public static final Integer MSG_RES_PSUC_CANTSUC = 3;
	public static final Integer MSG_RES_PSUC_SUCLIST = 300;
	public static final Integer MSG_RES_PSUC_SUCCODIGO = 10;
	public static final Integer MSG_RES_PSUC_SUCDESCRIPCION = 60;

	// Mensaje Canales por cia. (1105)
	// Mensaje
	public static final String MSG_PCAN_MESSAGEID = "1105";
	// Request
	public static final Integer MSG_REQ_PCAN_COMPANIA = 4;
	// Response
	public static final Integer MSG_RES_PCAN_INI = 12;
	public static final Integer MSG_RES_PCAN_CANTCANAL = 3;
	public static final Integer MSG_RES_PCAN_CANALLIST = 300;
	public static final Integer MSG_RES_PCAN_CANALCODIGO = 10;
	public static final Integer MSG_RES_PCAN_CANALDESCRIPCION = 60;

	// Mensaje Detalle de Endosos (1115)
	// Mensaje
	public static final String MSG_CEND_MessageID = "1115";
	// Request
	public static final Integer MSG_REQ_CEND_COMPANIA = 4;
	public static final Integer MSG_REQ_CEND_POLIZA = 40;
	public static final Integer MSG_REQ_CEND_FECHADESDE = 8;
	public static final Integer MSG_REQ_CEND_FECHAHASTA = 8;
	// Response
	public static final Integer MSG_RES_CEND_INI = 68;
	public static final Integer MSG_RES_CEND_producto = 10;
	public static final Integer MSG_RES_CEND_sucursal = 10;
	public static final Integer MSG_RES_CEND_canal = 10;
	public static final Integer MSG_RES_CEND_fechaEmision = 8;
	public static final Integer MSG_RES_CEND_estado = 10;
	public static final Integer MSG_RES_CEND_tomador = 30;
	public static final Integer MSG_RES_CEND_tipDoc = 15;
	public static final Integer MSG_RES_CEND_nroDoc = 11;
	public static final Integer MSG_RES_CEND_vendedorLegajo = 10;
	public static final Integer MSG_RES_CEND_vendedorNombre = 70;
	public static final Integer MSG_RES_CEND_cantEnd = 3;
	public static final Integer MSG_RES_CEND_endList = 300;
	public static final Integer MSG_RES_CEND_endEndoso = 6;
	public static final Integer MSG_RES_CEND_endVigenciaDesde = 8;
	public static final Integer MSG_RES_CEND_endVigenciaHasta = 8;
	public static final Integer MSG_RES_CEND_endMotivo = 60;

	// Mensaje ConSiniestro List (1301)
	// Mensaje
	public static final String MSG_CSIL_MessageID = "1301";
	// Request
	public static final Integer MSG_REQ_CSIL_tipoBusqueda = 1;
	public static final Integer MSG_REQ_CSIL_tipDoc = 2;
	public static final Integer MSG_REQ_CSIL_nroDoc = 11;
	public static final Integer MSG_REQ_CSIL_apellido = 30;
	public static final Integer MSG_REQ_CSIL_poliza = 40;
	public static final Integer MSG_REQ_CSIL_siniestro = 40;
	public static final Integer MSG_REQ_CSIL_orden = 10;
	public static final Integer MSG_REQ_CSIL_compania = 4;
	public static final Integer MSG_REQ_CSIL_estado = 1;
	public static final Integer MSG_REQ_CSIL_fechaDesde = 8;
	public static final Integer MSG_REQ_CSIL_fechaHasta = 8;
	public static final Integer MSG_REQ_CSIL_paramStart = 70;
	// Response
	public static final Integer MSG_RES_CSIL_INI = 233;
	public static final Integer MSG_RES_CSIL_cantReg = 3;
	public static final Integer MSG_RES_CSIL_csiList = 200;
	public static final Integer MSG_RES_CSIL_compania = 4;
	public static final Integer MSG_RES_CSIL_poliza = 40;
	public static final Integer MSG_RES_CSIL_tomador = 30;
	public static final Integer MSG_RES_CSIL_orden = 10;
	public static final Integer MSG_RES_CSIL_siniestro = 40;
	public static final Integer MSG_RES_CSIL_fechaSiniestro = 8;
	public static final Integer MSG_RES_CSIL_estado = 20;

	// Mensaje Detalle del Siniestro (1302)
	// Mensaje
	public static final String MSG_CSIN_MessageID = "1302";
	// Request
	public static final Integer MSG_REQ_CSIN_compania = 4;
	public static final Integer MSG_REQ_CSIN_siniestro = 40;
	// Response
	public static final Integer MSG_RES_CSIN_INI = 52;
	public static final Integer MSG_RES_CSIN_poliza = 40;
	public static final Integer MSG_RES_CSIN_tomador = 30;
	public static final Integer MSG_RES_CSIN_tipDoc = 15;
	public static final Integer MSG_RES_CSIN_nroDoc = 11;
	public static final Integer MSG_RES_CSIN_vigenciaDesde = 8;
	public static final Integer MSG_RES_CSIN_vigenciaHasta = 8;
	public static final Integer MSG_RES_CSIN_orden = 10;
	public static final Integer MSG_RES_CSIN_fechaRegistracion = 8;
	public static final Integer MSG_RES_CSIN_fechaComunicacion = 8;
	public static final Integer MSG_RES_CSIN_fechaSiniestro = 8;
	public static final Integer MSG_RES_CSIN_lugar = 50;
	public static final Integer MSG_RES_CSIN_causa = 30;
	public static final Integer MSG_RES_CSIN_cantCob = 2;
	public static final Integer MSG_RES_CSIN_cobList = 20;
	public static final Integer MSG_RES_CSIN_cobDescripcion = 20;
	public static final Integer MSG_RES_CSIN_estado = 20;
	public static final Integer MSG_RES_CSIN_fechaEstado = 8;
	public static final Integer MSG_RES_CSIN_cantDet = 2;
	public static final Integer MSG_RES_CSIN_detList = 50;
	public static final Integer MSG_RES_CSIN_detDescripcion = 60;
	public static final Integer MSG_RES_CSIN_cantEst = 2;
	public static final Integer MSG_RES_CSIN_estList = 20;
	public static final Integer MSG_RES_CSIN_estEstado = 20;
	public static final Integer MSG_RES_CSIN_estFechaEstado = 8;
	public static final Integer MSG_RES_CSIN_cantPag = 2;
	public static final Integer MSG_RES_CSIN_pagList = 20;
	public static final Integer MSG_RES_CSIN_pagDetalle = 20;
	public static final Integer MSG_RES_CSIN_pagBeneficiario = 30;
	public static final Integer MSG_RES_CSIN_pagImporte = 11;
	public static final Integer MSG_RES_CSIN_pagImporte_DEC = 2;
	public static final Integer MSG_RES_CSIN_pagFechaPago = 8;

	// Mensaje Documentacion Requerida Denuncia de Siniestros (1303)
	// Mensaje
	public static final String MSG_ODDR_MessageID = "1303";
	// Request
	public static final Integer MSG_REQ_ODDR_compania = 4;
	public static final Integer MSG_REQ_ODDR_producto = 10;
	// Response
	public static final Integer MSG_RES_ODDR_INI = 22;
	public static final Integer MSG_RES_ODDR_oddList = 15;
	public static final Integer MSG_RES_ODDR_documentacion = 60;

	// Mensaje Consulta Denuncia de Siniestros (1122)
	// Mensaje
	public static final String MSG_ODEC_MessageID = "1122";
	// Request
	public static final Integer MSG_REQ_ODEC_orden = 10;
	// Response
	public static final Integer MSG_RES_ODEC_INI = 18;
	public static final Integer MSG_RES_ODEC_compania = 4;
	public static final Integer MSG_RES_ODEC_producto = 10;
	public static final Integer MSG_RES_ODEC_poliza = 40;
	public static final Integer MSG_RES_ODEC_endoso = 6;
	public static final Integer MSG_RES_ODEC_siniestro = 40;
	public static final Integer MSG_RES_ODEC_fechaSiniestro = 8;
	public static final Integer MSG_RES_ODEC_esDenAseg = 1;
	public static final Integer MSG_RES_ODEC_denTipDoc = 15;
	public static final Integer MSG_RES_ODEC_denNroDoc = 11;
	public static final Integer MSG_RES_ODEC_denApeNom = 60;
	public static final Integer MSG_RES_ODEC_denParentesco = 2;
	public static final Integer MSG_RES_ODEC_tipDoc = 15;
	public static final Integer MSG_RES_ODEC_nroDoc = 11;
	public static final Integer MSG_RES_ODEC_tomador = 60;
	public static final Integer MSG_RES_ODEC_descSiniestro = 500;
	public static final Integer MSG_RES_ODEC_datosSiniestro = 500;
	public static final Integer MSG_RES_ODEC_estado = 1;
	public static final Integer MSG_RES_ODEC_fechaDenuncia = 8;
	public static final Integer MSG_RES_ODEC_peopleSoft = 10;
	public static final Integer MSG_RES_ODEC_usuApeNom = 60;

	// Mensaje Alta Denuncia de Siniestros (1121)
	// Mensaje
	public static final String MSG_ODEN_MessageID = "1121";
	// Request
	public static final Integer MSG_REQ_ODEN_compania = 4;
	public static final Integer MSG_REQ_ODEN_producto = 10;
	public static final Integer MSG_REQ_ODEN_poliza = 40;
	public static final Integer MSG_REQ_ODEN_endoso = 6;
	public static final Integer MSG_REQ_ODEN_fechaSiniestro = 8;
	public static final Integer MSG_REQ_ODEN_esDenAseg = 1;
	public static final Integer MSG_REQ_ODEN_denTipDoc = 10;
	public static final Integer MSG_REQ_ODEN_denNroDoc = 11;
	public static final Integer MSG_REQ_ODEN_denApeNom = 60;
	public static final Integer MSG_REQ_ODEN_denParentesco = 2;
	public static final Integer MSG_REQ_ODEN_tipDoc = 10;
	public static final Integer MSG_REQ_ODEN_nroDoc = 11;
	public static final Integer MSG_REQ_ODEN_tomador = 60;
	public static final Integer MSG_REQ_ODEN_descSiniestro = 500;
	public static final Integer MSG_REQ_ODEN_datosSiniestro = 500;
	public static final Integer MSG_REQ_ODEN_fechaDenuncia = 8;
	public static final Integer MSG_REQ_ODEN_peopleSoft = 10;
	public static final Integer MSG_REQ_ODEN_usuApeNom = 60;
	// Response
	public static final Integer MSG_RES_ODEN_INI = 1319;
	public static final Integer MSG_RES_ODEN_orden = 10;

	// Mensaje Cambio de Estado Denuncia de Siniestros (1305)
	// Mensaje
	public static final String MSG_ODES_MessageID = "1305";
	// Request
	public static final Integer MSG_REQ_ODES_orden = 10;
	public static final Integer MSG_REQ_ODES_estado = 1;
	// Response
	public static final Integer MSG_RES_ODES_INI = 19;

	// Mensaje OpeSiniestro List (1304)
	// Mensaje
	public static final String MSG_ODEL_MessageID = "1304";
	// Request
	public static final Integer MSG_REQ_ODEL_tipoBusqueda = 1;
	public static final Integer MSG_REQ_ODEL_tipDoc = 2;
	public static final Integer MSG_REQ_ODEL_nroDoc = 11;
	public static final Integer MSG_REQ_ODEL_apellido = 60;
	public static final Integer MSG_REQ_ODEL_poliza = 40;
	public static final Integer MSG_REQ_ODEL_orden = 10;
	public static final Integer MSG_REQ_ODEL_compania = 4;
	public static final Integer MSG_REQ_ODEL_estado = 1;
	public static final Integer MSG_REQ_ODEL_fechaDesde = 8;
	public static final Integer MSG_REQ_ODEL_fechaHasta = 8;
	public static final Integer MSG_REQ_ODEL_paramStart = 18;
	// Response
	public static final Integer MSG_RES_ODEL_INI = 171;
	public static final Integer MSG_RES_ODEL_cantReg = 3;
	public static final Integer MSG_RES_ODEL_denList = 200;
	public static final Integer MSG_RES_ODEL_compania = 4;
	public static final Integer MSG_RES_ODEL_poliza = 40;
	public static final Integer MSG_RES_ODEL_tomador = 60;
	public static final Integer MSG_RES_ODEL_orden = 10;
	public static final Integer MSG_RES_ODEL_fechaDenuncia = 8;
	public static final Integer MSG_RES_ODEL_estado = 1;
}
