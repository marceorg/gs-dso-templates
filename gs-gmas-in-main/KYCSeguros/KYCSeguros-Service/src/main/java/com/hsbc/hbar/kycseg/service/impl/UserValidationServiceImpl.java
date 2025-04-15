/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.impl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.json.XML;

import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.constant.WASConstants;
import com.hsbc.hbar.kycseg.model.enums.DestinationEnum;
import com.hsbc.hbar.kycseg.model.enums.MdwEnum;
import com.hsbc.hbar.kycseg.service.MdwService;
import com.hsbc.hbar.kycseg.service.UserValidationService;
import com.hsbc.hbar.kycseg.service.utils.KeyGenerator;

public class UserValidationServiceImpl implements UserValidationService {
	static Logger logger = LogManager.getLogger(UserValidationServiceImpl.class);

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

	public AuthorizedUser getAuthorizedUser(final HttpServletRequest httpServletRequest, final Integer cache) {
		HttpSession session = httpServletRequest.getSession();
		String user = httpServletRequest.getUserPrincipal().getName();

		if (user != null) {
			if (user.indexOf("CN=") > -1) {
				user = user.substring(user.indexOf("CN=") + 3, user.indexOf(",", user.indexOf("CN=")));
			}
			AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
			if (au == null) {
				au = validateUser(user);
				session.setAttribute("authorizedUser", au);
			}
			return au;
		} else {
			return null;
		}
	}

	public Boolean setAuthorizedUser(final HttpServletRequest httpServletRequest, final String peopleSoft) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = null;
		if (!peopleSoft.equalsIgnoreCase("logout")) {
			au = validateUser(peopleSoft);
			session.setAttribute("authorizedUser", au);
		} else {
			session.invalidate();
		}

		if (au == null) {
			return false;
		} else {
			return true;
		}
	}

	private AuthorizedUser validateUser(final String peopleSoft) {
		AuthorizedUser authorizedUser = null;

		try {
			// Obtengo Token
			JSONObject requestTkn = new JSONObject();
			requestTkn.put("ServrId", KeyGenerator.getServerId("OVNYL"));
			requestTkn.put("ActnCde", "OVNYL");
			requestTkn.put("Username", "OVNYL/" + peopleSoft);
			requestTkn.put("Password", KeyGenerator.getUserKey(WASConstants.WC_OVNYL_KEY, peopleSoft));
			String respTkn = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_GET_ACCESS_TOKEN_BY_TYPE,
					requestTkn.toString());

			JSONObject responseTkn = new JSONObject(respTkn);
			if (!responseTkn.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				return null;
			}
			String resSegTok = responseTkn.getJSONObject("Message").getJSONObject("Response").getString("theContentType");

			// Autentico con Maxima
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("BinarySecurityToken", resSegTok);
			requestSvc.put("ServrId", KeyGenerator.getServerId("OVNYL"));
			requestSvc.put("ActnCde", "OVNYL");
			requestSvc.put("RspCde", peopleSoft);
			requestSvc.put("Domain", "HLAH");
			requestSvc.put("OrganizationId", "2");
			requestSvc.put("SystemId", "KYCSEG");
			requestSvc.put("UserId", peopleSoft);
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_RETRIEVE_CREDENTIAL_DETAILS,
					requestSvc.toString());
			// Verifica en Seguridad de Maxima si el usuario tiene permisos
			JSONObject responseSvc = new JSONObject(respSvc);
			if (!responseSvc.getString("Code").equalsIgnoreCase("NO_ERROR")) {
				return null;
			}
			JSONObject credentialsObject = XML.toJSONObject(responseSvc.getJSONObject("Message").getJSONObject("Response")
					.getString("BusDataSeg"));
			String lastName = credentialsObject.getJSONObject("BusDataSeg").getString("LastName");
			String firstName = credentialsObject.getJSONObject("BusDataSeg").getString("FirstName");
			String rol = credentialsObject.getJSONObject("BusDataSeg").getJSONObject("Mandates").getString("Name");

			authorizedUser = new AuthorizedUser();
			authorizedUser.setPeopleSoft(peopleSoft);
			authorizedUser.setfName(firstName);
			authorizedUser.setlName(lastName);
			authorizedUser.setProfileKey(rol);
			authorizedUser.setToken(resSegTok);
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
		}

		return authorizedUser;
	}
}
