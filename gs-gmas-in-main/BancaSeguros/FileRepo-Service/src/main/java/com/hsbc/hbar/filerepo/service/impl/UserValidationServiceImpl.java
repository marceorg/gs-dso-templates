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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.json.XML;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.constant.MsgConstants;
import com.hsbc.hbar.filerepo.model.constant.WASConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.UserValidationService;
import com.hsbc.hbar.filerepo.service.utils.KeyGenerator;

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
			// Setear un nuevo obj para retornar el usuario
			AuthorizedUser rAu = new AuthorizedUser();
			rAu.setPeopleSoft(au.getPeopleSoft());
			rAu.setfName(au.getfName());
			rAu.setlName(au.getlName());
			rAu.setProfileKey(au.getProfileKey());
			rAu.setProfileLabel(au.getProfileLabel());
			rAu.setProfileType(au.getProfileType());
			rAu.setToken("");
			return rAu;
		} else {
			return null;
		}
	}

	public Boolean setAuthorizedUser(final HttpServletRequest httpServletRequest, final Integer cache,
			final String peopleSoft) {
		HttpSession session = httpServletRequest.getSession();
		if (peopleSoft.equalsIgnoreCase("logout")) {
			session.invalidate();
			return true;
		} else {
			// Sacas esto cuando se termine de probar
			AuthorizedUser au = null;
			au = validateUser(peopleSoft);
			session.setAttribute("authorizedUser", au);
			if (au == null) {
				return false;
			} else {
				return true;
			}
		}
	}

	public Boolean getPermissionGrant(final String perfil, final String tipoPer, final String funcionalidad) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_PER", perfil);
			request.put("TIP_PER", tipoPer);
			request.put("COD_FUN", funcionalidad);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_PERMISO_SEL,
					request.toString());
			JSONObject responseSvc = new JSONObject(response);
			if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return false;
			} else {
				if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
					String permissionGrant = responseSvc.getJSONObject(MsgConstants.MC_MSG)
							.getJSONObject(MsgConstants.MC_RGS).getJSONArray(MsgConstants.MC_REG).getJSONObject(0)
							.getString("PER_GRA");
					if (permissionGrant.equalsIgnoreCase("OK")) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
			return false;
		}
	}

	public Boolean getSolicitudGrant(final String producto, final String solicitud, final String perfil,
			final String peopleSoft) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_PRO", producto);
			request.put("NRO_SOL", solicitud);
			request.put("COD_PER", perfil);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_SEL,
					request.toString());
			JSONObject responseSvc = new JSONObject(response);
			if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return false;
			} else {
				if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
					String userGrant = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
							.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("UTO_COD");
					if (userGrant.equalsIgnoreCase(peopleSoft)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
			return false;
		}
	}

	public Boolean getSolicVerGrant(final String producto, final String solicitud, final String fase) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_PRO", producto);
			request.put("NRO_SOL", solicitud);
			request.put("COD_FAS", fase);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLIC_EST_VER,
					request.toString());
			JSONObject responseSvc = new JSONObject(response);
			if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return false;
			} else {
				if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
					String solvGrant = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
							.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("RES_MSG");
					if (solvGrant.equalsIgnoreCase("OK")) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
			return false;
		}
	}

	public Boolean getTipoDocumGrant(final String producto, final String solicitud, final String archivo,
			final String peopleSoft) {
		try {
			// Verificar el usuario que lo subio
			JSONObject requestARC = new JSONObject();
			requestARC.put("COD_PRO", producto);
			requestARC.put("NRO_SOL", solicitud);
			requestARC.put("NRO_ARC", archivo);
			String responseARC = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSOL_SEL,
					requestARC.toString());
			JSONObject resSvcARC = new JSONObject(responseARC);
			if (!resSvcARC.has("Code") || !resSvcARC.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return false;
			} else {
				if (resSvcARC.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
					String usuario = resSvcARC.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
							.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("UIN_COD");
					if (usuario.equalsIgnoreCase("OV")) {
						// Si fue en la OV
						return false;
					} else if (usuario.equalsIgnoreCase(peopleSoft)) {
						// Si fue el mismo usuario
						return true;
					} else {
						// Si fue otro
						Integer tipoDoc = resSvcARC.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
								.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getInt("COD_TDO");
						// Verificar si el documento se puede borrar
						JSONObject requestTDO = new JSONObject();
						requestTDO.put("COD_TDO", tipoDoc);
						requestTDO.put("IND_BAJ", false);
						String responseTDO = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_PAR_TIPODOC_SEL, requestTDO.toString());
						JSONObject resSvcTDO = new JSONObject(responseTDO);
						if (!resSvcTDO.has("Code") || !resSvcTDO.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							return false;
						} else {
							if (resSvcTDO.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
									.getJSONArray(MsgConstants.MC_REG).length() > 0) {
								Boolean indBorrado = resSvcTDO.getJSONObject(MsgConstants.MC_MSG)
										.getJSONObject(MsgConstants.MC_RGS).getJSONArray(MsgConstants.MC_REG)
										.getJSONObject(0).getBoolean("IND_BOR");
								if (indBorrado) {
									return true;
								} else {
									return false;
								}
							} else {
								return false;
							}
						}
					}
				} else {
					return false;
				}
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
			return false;
		}
	}

	public Boolean getUserFileGrant(final String producto, final String solicitud, final String archivo,
			final String peopleSoft) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_PRO", producto);
			request.put("NRO_SOL", solicitud);
			request.put("NRO_ARC", archivo);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSOL_SEL,
					request.toString());
			JSONObject responseSvc = new JSONObject(response);
			if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return false;
			} else {
				if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
					String userGrant = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
							.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("UIN_COD");
					if (userGrant.equalsIgnoreCase(peopleSoft)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
			return false;
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
			if (!responseTkn.has("Code") || !responseTkn.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return null;
			}
			String resSegTok = responseTkn.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RES)
					.getString("theContentType");

			// Autentico con Maxima
			JSONObject requestSvc = new JSONObject();
			requestSvc.put("BinarySecurityToken", resSegTok);
			requestSvc.put("ServrId", KeyGenerator.getServerId("OVNYL"));
			requestSvc.put("ActnCde", "OVNYL");
			requestSvc.put("RspCde", peopleSoft);
			requestSvc.put("Domain", "HLAH");
			requestSvc.put("OrganizationId", "2");
			requestSvc.put("SystemId", "FILEREPO");
			requestSvc.put("UserId", peopleSoft);
			String respSvc = this.getMdwService().getInsSvcGen(DestinationEnum.WS, MdwEnum.WS_RETRIEVE_CREDENTIAL_DETAILS,
					requestSvc.toString());
			// Verifica en Seguridad de Maxima si el usuario tiene permisos
			JSONObject responseSvc = new JSONObject(respSvc);
			if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				return null;
			}
			JSONObject cObject = XML.toJSONObject(responseSvc.getJSONObject(MsgConstants.MC_MSG)
					.getJSONObject(MsgConstants.MC_RES).getString(MsgConstants.MC_BDS));
			String lastName = cObject.getJSONObject(MsgConstants.MC_BDS).getString("LastName");
			String firstName = cObject.getJSONObject(MsgConstants.MC_BDS).getString("FirstName");
			String rol = cObject.getJSONObject(MsgConstants.MC_BDS).getJSONObject("Mandates").getString("Name");

			authorizedUser = new AuthorizedUser();
			authorizedUser.setPeopleSoft(peopleSoft);
			authorizedUser.setfName(firstName);
			authorizedUser.setlName(lastName);
			authorizedUser.setToken(resSegTok);
			// Set Profile
			if (rol.equalsIgnoreCase(FRConstants.FR_UP_ADMINS)) {
				// Administrador
				authorizedUser.setProfileKey("A");
				authorizedUser.setProfileLabel(FRConstants.FR_UP_ADMINS);
				authorizedUser.setProfileType("");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_CONSUL)) {
				// Consulta
				authorizedUser.setProfileKey("C");
				authorizedUser.setProfileLabel(FRConstants.FR_UP_CONSUL);
				authorizedUser.setProfileType("");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_MOFANA)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("M");
				authorizedUser.setProfileLabel("MIDDLEOFFICE");
				authorizedUser.setProfileType("A");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_MOFSUP)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("M");
				authorizedUser.setProfileLabel("MIDDLEOFFICE");
				authorizedUser.setProfileType("S");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_SUSANA)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("S");
				authorizedUser.setProfileLabel("SUSCRIPCION");
				authorizedUser.setProfileType("A");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_SUSSUP)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("S");
				authorizedUser.setProfileLabel("SUSCRIPCION");
				authorizedUser.setProfileType("S");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_EMIANA)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("E");
				authorizedUser.setProfileLabel("EMISION");
				authorizedUser.setProfileType("A");
			} else if (rol.equalsIgnoreCase(FRConstants.FR_UP_EMISUP)) {
				// MiddleOffice Analista
				authorizedUser.setProfileKey("E");
				authorizedUser.setProfileLabel("EMISION");
				authorizedUser.setProfileType("S");
			}
		} catch (Exception e) {
			UserValidationServiceImpl.logger.error(e);
		}

		return authorizedUser;
	}
}
