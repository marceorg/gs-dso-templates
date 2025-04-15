/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2016. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.enums;

public enum MdwEnum {
	// WS
	WS_GET_ACCESS_TOKEN_BY_TYPE("wsGetAccessTokenByType"),
	WS_RETRIEVE_CREDENTIAL_DETAILS("wsRetrieveCredentialDetails"),
	WS_RETRIEVE_QBE_DOCUMENTS("wsRetrieveQBEDocuments"),
	WS_GENERATEANDRETURN_PDF_REPORT("wsGenerateAndReturnPdfReport"),
	WS_GENERATE_PDF_REPORT("wsGeneratePdfReport"),
	WS_GENERATE_PDF_REPORT_TEXTO("wsGeneratePdfReportTexto"),
	WS_SEND_PDF_REPORT("wsSendPdfReport"),
	WS_RETRIEVE_REPORT("wsRetrieveReport"),
	WS_RETRIEVE_REPORT_LIST("wsRetrieveReportList"),
	WS_PUBLIC_REPORT("wsPublishReport"),
	// MQ
	MQ_1011_BS_SITUACION_COBRANZAS("1011_BS_SituacionCobranza"),
	MQ_1201_BS_TIPO_RECLAMO("1201_BS_TipoReclamo"),
	MQ_1202_BS_MOT_RECLAMO("1202_BS_MotReclamo"),
	MQ_1203_BS_ALTA_RECLAMO("1203_BS_AltaReclamo"),
	MQ_1204_BS_ESTADO_RECLAMO("1204_BS_EstadoReclamo"),
	MQ_1205_BS_RECLAMO_LIST("1205_BS_ReclamoList"),
	MQ_1206_BS_CONS_RECLAMO("1206_BS_ConsReclamo");

	private String name;

	private MdwEnum(final String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}
}
