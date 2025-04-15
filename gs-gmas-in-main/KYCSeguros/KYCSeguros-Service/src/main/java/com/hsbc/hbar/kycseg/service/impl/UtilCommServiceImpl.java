package com.hsbc.hbar.kycseg.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
import org.json.XML;

import com.hsbc.hbar.kycseg.model.common.FileParam;
import com.hsbc.hbar.kycseg.model.enums.DestinationEnum;
import com.hsbc.hbar.kycseg.model.enums.MdwEnum;
import com.hsbc.hbar.kycseg.service.MdwService;
import com.hsbc.hbar.kycseg.service.UtilCommService;

public class UtilCommServiceImpl implements UtilCommService {
	private MdwService mdwService;

	public MdwService getMdwService() {
		if (this.mdwService == null) {
			this.mdwService = (MdwService) ServiceFactory.getContext().getBean(
					"MdwService");
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
		requestSvc.put("xmlDataSource",
				Base64.encodeBase64String(xmlData.getBytes()));
		requestSvc.put("RepId", reportID);
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS,
				MdwEnum.WS_GENERATE_PDF_REPORT_TEXTO, requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			b64PDF = responseSvc.getJSONObject("Message")
					.getJSONObject("Response")
					.getString("generatePdfReportReturn");
		}
		return b64PDF;
	}

	public Boolean publishReport(final String report, final Long orden) {
		JSONObject requestSvc = new JSONObject();
		requestSvc.put("applicationId", "NYLVO");
		requestSvc.put("report", report);
		requestSvc
				.put("coldViewPubNode",
						"CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata",
				"nroorden=" + String.format("%010d", orden));
		requestSvc.put("reportName", "DocAdjunto.pdf");
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS,
				MdwEnum.WS_PUBLIC_REPORT, requestSvc.toString());
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
		requestSvc
				.put("coldViewPubNode",
						"CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata",
				"nroorden=" + String.format("%010d", orden));
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS,
				MdwEnum.WS_RETRIEVE_REPORT_LIST, requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			JSONObject listObject = XML.toJSONObject(responseSvc
					.getJSONObject("Message").getJSONObject("Response")
					.getString("retrieveReportListReturn"));
			List<String> arrList = new ArrayList<String>();
			for (int i = 0; i < listObject.length(); i++) {
				arrList.add(listObject.getJSONArray("items").getJSONObject(i)
						.getString("item"));
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
		requestSvc
		.put("coldViewPubNode",
				"CVUN_RepositoryEstructure/CVUns_Pub_Root/HSBCGroup/HSBCBancaSeguros/Denuncias");
		requestSvc.put("coldViewMetadata",
				"nroorden=" + String.format("%010d", orden));
		requestSvc.put("item", item);
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS,
				MdwEnum.WS_RETRIEVE_REPORT, requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			b64PDF = responseSvc.getJSONObject("Message")
					.getJSONObject("Response").getString("report");
		}
		return b64PDF;
	}

	public Boolean sendPdfReport(final FileParam[] files,
			final String recipientTO, final String recipientsCC,
			final String recipientsBCC, final String templateFileName,
			final String parametersTemplate, final String from,
			final String replyTO, final String bodyText, final String subject) {
		// Armo XML Files
		String xmlFiles = "";
		if (files.length > 0) {
			for (int x = 0; x < files.length; x++) {
				xmlFiles += "<file>";
				xmlFiles += "<content>";
				xmlFiles += files[x].getContent();
				xmlFiles += "</content>";
				xmlFiles += "<name>";
				xmlFiles += files[x].getName();
				xmlFiles += "</name>";
				xmlFiles += "</file>";
			}
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
		String resp = this.getMdwService().getInsSvcGen(DestinationEnum.WS,
				MdwEnum.WS_SEND_PDF_REPORT, requestSvc.toString());
		// Verifica error
		JSONObject responseSvc = new JSONObject(resp);
		if (responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
			return true;
		} else {
			return false;
		}
	}
}
