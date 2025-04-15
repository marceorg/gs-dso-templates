/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.service;

import com.hsbc.hbar.filerepo.model.common.FileParam;

public interface UtilCommService {
	public String generatePDFReport(final String xmlData, final String reportID);

	public Boolean sendPdfReport(final FileParam[] files, final String recipientTO, final String recipientsCC,
			final String recipientsBCC, final String templateFileName, final String parametersTemplate, final String from,
			final String replyTO, final String bodyText, final String subject);
}
