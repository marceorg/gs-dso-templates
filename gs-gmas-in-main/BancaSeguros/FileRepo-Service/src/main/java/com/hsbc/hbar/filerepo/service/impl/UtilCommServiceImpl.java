/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.service.impl;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;

import com.hsbc.hbar.filerepo.model.common.FileParam;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.constant.MsgConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.UtilCommService;

public class UtilCommServiceImpl implements UtilCommService {
	private MdwService mdwService;

	public MdwService getMdwService() {
		if (this.mdwService == null) {
			this.mdwService = (MdwService) ServiceFactory.getContext().getBean("MdwService");
		}
		return this.mdwService;
	}

	public void setMdwService(final MdwService mdwService) {
		this.mdwService = mdwService;
	}

	public String generatePDFReport(final String xmlData, final String reportID) {
		String b64PDF = "";
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("xmlDataSource", Base64.encodeBase64String(xmlData.getBytes()));
		requestSvc.put("RepId", reportID);
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_GENERATE_PDF_REPORT_TEXTO,
				requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
			b64PDF = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RES)
					.getString("generatePdfReportReturn");
		}
		return b64PDF;
	}

	public Boolean sendPdfReport(final FileParam[] files, final String recipientTO, final String recipientsCC,
			final String recipientsBCC, final String templateFileName, final String parametersTemplate, final String from,
			final String replyTO, final String bodyText, final String subject) {
		// Armo XML Files
		StringBuilder sBuf = new StringBuilder();
		String xmlFiles = "";
		if (files != null && files.length > 0) {
			for (int x = 0; x < files.length; x++) {
				sBuf.append("<file>" + "<content>" + files[x].getContent() + "</content>" + "<name>" + files[x].getName()
						+ "</name>" + "</file>");
			}
			xmlFiles = sBuf.toString();
		}
		// Llamada al servicio
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("files", xmlFiles);
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("recipientTO", recipientTO);
		requestSvc.put("recipientsCC", recipientsCC);
		requestSvc.put("recipientsBCC", recipientsBCC);
		requestSvc.put("templateFileName", templateFileName);
		requestSvc.put("parametersTemplate", parametersTemplate);
		requestSvc.put("from", from);
		requestSvc.put("replyTO", replyTO);
		requestSvc.put("bodyText", bodyText);
		requestSvc.put("subject", subject);
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_SEND_PDF_REPORT,
				requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
			return true;
		} else {
			return false;
		}
	}
}
