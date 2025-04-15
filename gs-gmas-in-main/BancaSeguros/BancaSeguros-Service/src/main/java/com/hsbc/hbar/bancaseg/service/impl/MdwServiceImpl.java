/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2017. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import com.hsbc.hbar.bancaseg.dao.ParametersDao;
import com.hsbc.hbar.bancaseg.model.enums.DestinationEnum;
import com.hsbc.hbar.bancaseg.model.enums.MdwEnum;
import com.hsbc.hbar.bancaseg.service.MdwService;

public class MdwServiceImpl implements MdwService {
	static Logger logger = LogManager.getLogger(MdwServiceImpl.class);

	private static final String DESTINATION = "destination";
	private static final String SERVICE_NAME = "serviceName";
	private static final String INPUT = "input";

	private ParametersDao parametersDao;

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
	}

	private String getParamGral(final String param) {
		return this.getParametersDao().getParamGral(param);
	}

	public String getInsSvcGen(final DestinationEnum destination, final MdwEnum serviceName, final String request) {
		String strErr = "";

		try {
			JSONObject jsonRequest = new JSONObject();
			jsonRequest.put(MdwServiceImpl.DESTINATION, destination.name());
			jsonRequest.put(MdwServiceImpl.SERVICE_NAME, serviceName.getName());
			jsonRequest.put(MdwServiceImpl.INPUT, new JSONObject(request));

			URL obj = new URL(this.getParamGral("INSSVCURL") + "/inssvcgen/execute");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			// add request header
			con.setRequestMethod("POST");
			con.setRequestProperty("Authorization", "Bearer " + this.getJwtToken(this.getParamGral("INSSVCKEY")));
			con.setRequestProperty("Content-Type", "application/json; charset=ISO-8859-1");

			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(jsonRequest.toString());
			wr.flush();
			wr.close();

			int responseCode = con.getResponseCode();
			if (responseCode != 200) {
				strErr = con.getResponseMessage();
			}

			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), "ISO-8859-1"));
			String inputLine;
			StringBuilder response = new StringBuilder();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			return response.toString();
		} catch (Exception e) {
			MdwServiceImpl.logger.error(e);
			return "{\"Error\":\"Execution error(" + strErr + " - " + e.getMessage() + ")\"}";
		}
	}

	private String getJwtToken(final String sck) {
		Claims claims = Jwts.claims().setSubject("APPSATELITES");
		try {
			return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS512, new String(Base64.decodeBase64(sck)))
					.compact();
		} catch (Exception e) {
			MdwServiceImpl.logger.error(e);
			return "";
		}
	}
}
