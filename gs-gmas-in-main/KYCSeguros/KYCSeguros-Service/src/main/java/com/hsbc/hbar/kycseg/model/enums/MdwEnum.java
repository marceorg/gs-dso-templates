/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2016. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.enums;

public enum MdwEnum {
	WS_GET_ACCESS_TOKEN_BY_TYPE("wsGetAccessTokenByType"), WS_RETRIEVE_CREDENTIAL_DETAILS(
			"wsRetrieveCredentialDetails"),

			WS_GENERATE_PDF_REPORT("wsGeneratePdfReport"), WS_GENERATE_PDF_REPORT_TEXTO(
							"wsGeneratePdfReportTexto"), WS_SEND_PDF_REPORT("wsSendPdfReport"), WS_RETRIEVE_REPORT(
									"wsRetrieveReport"), WS_RETRIEVE_REPORT_LIST("wsRetrieveReportList"), WS_PUBLIC_REPORT(
											"wsPublicReport");

	private String name;

	private MdwEnum(final String name) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}
}
