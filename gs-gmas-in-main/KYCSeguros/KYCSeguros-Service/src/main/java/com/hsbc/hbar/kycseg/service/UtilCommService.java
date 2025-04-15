package com.hsbc.hbar.kycseg.service;

import java.util.List;

import com.hsbc.hbar.kycseg.model.common.FileParam;

public interface UtilCommService {
	public String generatePDFReport(final String xmlData, final String reportID);

	public Boolean publishReport(final String report, final Long orden);

	public List<String> retrieveReportList(final Long orden);

	public String retrieveReport(final Long orden, final String item);

	public Boolean sendPdfReport(final FileParam[] files,
			final String recipientTO, final String recipientsCC,
			final String recipientsBCC, final String templateFileName,
			final String parametersTemplate, final String from,
			final String replyTO, final String bodyText, final String subject);
}
