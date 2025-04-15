/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.bancaseg.service.JMSCommService;
import com.hsbc.hbar.bancaseg.service.UtilCommService;

public class ControllerPubServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerPubServiceImpl.class);

	private JMSCommService jmsCommService;
	private UtilCommService utilCommService;

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
	}

	public UtilCommService getUtilCommService() {
		if (this.utilCommService == null) {
			this.utilCommService = (UtilCommService) ServiceFactory.getContext().getBean("UtilCommService");
		}
		return this.utilCommService;
	}

	public void setUtilCommService(final UtilCommService utilCommService) {
		this.utilCommService = utilCommService;
	}

	public ModelAndView handleRequest(final HttpServletRequest request, final HttpServletResponse response)
			throws ServletException, IOException {
		Boolean ret = true;
		byte[] bB64 = null;
		String b64rep = "";
		try {
			// Parametros
			Long orden = Long.parseLong(request.getParameterValues("orden")[0]);
			// Archivo
			List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
			for (FileItem item : items) {
				if (item.isFormField()) {
					// Process regular form field
				} else {
					// Process form file field (input type="file").
					InputStream fileContent = item.getInputStream();
					bB64 = getBytes(fileContent);
					b64rep = Base64.encodeBase64String(bB64);
				}
			}
			if (!this.getUtilCommService().publishReport(b64rep, orden)) {
				ret = false;
			}
		} catch (Exception e) {
			ControllerPubServiceImpl.logger.error(e);
			ret = false;
		}
		// Armar respuesta
		OutputStream responseOutputStream = null;
		response.setContentType("text/html");
		responseOutputStream = response.getOutputStream();
		String resp = (ret ? "S" : "N");
		responseOutputStream.write(resp.getBytes());
		responseOutputStream.flush();
		responseOutputStream.close();
		// Return
		return new ModelAndView("publishSvc");
	}

	private static byte[] getBytes(final InputStream is) throws IOException {

		int len;
		int size = 1024;
		byte[] buf;

		if (is instanceof ByteArrayInputStream) {
			size = is.available();
			buf = new byte[size];
			len = is.read(buf, 0, size);
		} else {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			buf = new byte[size];
			while ((len = is.read(buf, 0, size)) != -1) {
				bos.write(buf, 0, len);
			}
			buf = bos.toByteArray();
		}
		return buf;
	}
}
