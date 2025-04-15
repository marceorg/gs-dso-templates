/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.json.XML;

import com.hsbc.hbar.bancaseg.model.common.FileParam;
import com.hsbc.hbar.bancaseg.model.enums.DestinationEnum;
import com.hsbc.hbar.bancaseg.model.enums.MdwEnum;
import com.hsbc.hbar.bancaseg.service.MdwService;
import com.hsbc.hbar.bancaseg.service.UtilCommService;
import com.hsbc.hbar.bancaseg.service.utils.KeyGenerator;

public class UtilCommServiceImpl implements UtilCommService {
	static Logger logger = LogManager.getLogger(UtilCommServiceImpl.class);

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
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			b64PDF = responseSvc.getJSONObject("Message").getJSONObject("Response").getString("generatePdfReportReturn");
		}
		return b64PDF;
	}

	public Boolean publishReport(final String report, final Long orden) {
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("report", report);
		requestSvc.put("coldViewPubNode", "CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata", "nroorden=" + String.format("%010d", orden));
		requestSvc.put("reportName", "DocAdjunto.pdf");
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_PUBLIC_REPORT, requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			return true;
		} else {
			return false;
		}
	}

	public List<String> retrieveReportList(final Long orden) {
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("coldViewPubNode", "CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata", "nroorden=" + String.format("%010d", orden));
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_RETRIEVE_REPORT_LIST,
				requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			JSONObject listObject = XML.toJSONObject(responseSvc.getJSONObject("Message").getJSONObject("Response")
					.getString("retrieveReportListReturn"));
			List<String> arrList = new ArrayList<String>();
			for (int i = 0; i < listObject.length(); i++) {
				arrList.add(listObject.getJSONArray("items").getJSONObject(i).getString("item"));
			}
			return arrList;
		} else {
			return null;
		}
	}

	public String retrieveReport(final Long orden, final String item) {
		String b64PDF = "";
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("coldViewPubNode", "CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata", "nroorden=" + String.format("%010d", orden));
		requestSvc.put("item", item);
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_RETRIEVE_REPORT,
				requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			b64PDF = responseSvc.getJSONObject("Message").getJSONObject("Response").getString("report");
		}
		return b64PDF;
	}

	public Boolean sendPdfReport(final FileParam[] files, final String recipientTO, final String recipientsCC,
			final String recipientsBCC, final String templateFileName, final String parametersTemplate, final String from,
			final String replyTO, final String bodyText, final String subject) {
		// Armo XML Files
		StringBuilder sBuf = new StringBuilder();
		String xmlFiles = "";
		if (files.length > 0) {
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
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			return true;
		} else {
			return false;
		}
	}

	// Se agrega servicio de impresion polizas QBE
	public String retrieveQBEDocuments(final String peoplesoft, final String token, final String poliza, final Long orden) {
		String b64PDF = "";
		try {
			// producto variable - jose
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("BinarySecurityToken", token);
			requestSvc.put("ServrId", KeyGenerator.getServerId("OVNYL"));
			requestSvc.put("UserId", peoplesoft);
			String s1 = poliza;
			requestSvc.put("UseCde", s1.substring(0, 4));
			// polizann - polizsec - certian - certipol - certisec
			// Ejemplo: XXXX-99-009999-0099-0099-000999-0000
			requestSvc.put("PlcyYear", s1.substring(5, 7));
			requestSvc.put("PlcySec", s1.substring(8, 14));
			requestSvc.put("PlcyCert", s1.substring(15, 19));
			requestSvc.put("CertYear", s1.substring(20, 24));
			requestSvc.put("CertSec", s1.substring(25, 31));
			requestSvc.put("PlcyOpr", s1.substring(32, 36));
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_RETRIEVE_QBE_DOCUMENTS,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (!responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				return null;
			}
			JSONObject b64pdfObject = XML.toJSONObject(responseSvc.getJSONObject("Message").getJSONObject("Response")
					.getString("BusDataSeg"));
			if (orden == 0) {
				b64PDF = b64pdfObject.getJSONObject("BusDataSeg").getJSONArray("DocInfo").getJSONObject(0)
						.getString("FileContent");
			} else {
				for (int x = 0; x < b64pdfObject.getJSONObject("BusDataSeg").getJSONArray("DocInfo").length(); x++) {
					if (b64pdfObject.getJSONObject("BusDataSeg").getJSONArray("DocInfo").getJSONObject(x)
							.getString("FileDesc").equalsIgnoreCase("CERTIFICADO DE MERCOSUR")) {
						b64PDF = b64pdfObject.getJSONObject("BusDataSeg").getJSONArray("DocInfo").getJSONObject(x)
								.getString("FileContent");
					}
				}
			}
		} catch (Exception e) {
			UtilCommServiceImpl.logger.error(e);
		}

		return b64PDF;
	}

	// Se agrega servicio de impresion polizas NYL
	public String generateAndReturnPdfReport(final String poliza) {
		String b64PDF = "";
		try {
			// producto variable - jose
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("applicationId", "NYLP");
			// Ejemplo: XXXX-99-009999-0099-0099-000999-0000
			// polizann - polizsec - certian - certipol - certisec
			String s1 = poliza;
			String s2 = "0020" + s1.substring(0, 4) + s1.substring(5, 7) + s1.substring(8, 14) + s1.substring(15, 19)
					+ s1.substring(20, 24) + s1.substring(25, 31) + s1.substring(32, 36) + "-000000000-00           -";
			requestSvc.put("reportId", s2);
			requestSvc.put("reportName", "FRENTES   -");
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_GENERATEANDRETURN_PDF_REPORT,
					requestSvc.toString());
			JSONObject responseSvc = new JSONObject(respSvc);
			if (!responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				return null;
			}
			b64PDF = responseSvc.getJSONObject("Message").getJSONObject("Response").getString("generateAndReturnPdfReport");
		} catch (Exception e) {
			UtilCommServiceImpl.logger.error(e);
		}

		return b64PDF;
	}

}
