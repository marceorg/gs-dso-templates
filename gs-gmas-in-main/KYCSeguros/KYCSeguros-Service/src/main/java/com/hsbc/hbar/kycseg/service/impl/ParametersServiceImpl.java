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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.hsbc.hbar.kycseg.dao.ParametersDao;
import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CategoriaGS;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.constant.KYCSegConstants;
import com.hsbc.hbar.kycseg.service.JMSCommService;
import com.hsbc.hbar.kycseg.service.ParametersService;
import com.hsbc.hbar.kycseg.service.utils.UtilFormat;

public class ParametersServiceImpl implements ParametersService {
	static Logger logger = LogManager.getLogger(ParametersServiceImpl.class);

	private ParametersDao parametersDao;
	private JMSCommService jmsCommService;

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
	}

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
	}

	public List<Provincia> getProvinciaList() {
		return this.getParametersDao().getProvinciaList();
	}

	public List<TipoDoc> getTipoDocList() {
		return this.getParametersDao().getTipoDocList();
	}

	public List<CondicionIVA> getCondicionIVAList() {
		return this.getParametersDao().getCondicionIVAList();
	}

	public List<Caracter> getCaracterList() {
		return this.getParametersDao().getCaracterList();
	}

	public List<Pais> getPaisList() {
		return this.getJMSCommService().getPaisList();
	}

	public List<Actividad> getActividadList(final String filtroAct) {
		return this.getJMSCommService().getActividadList(UtilFormat.getValChars(filtroAct));
	}

	public List<AuthorizedUser> getSupervisorList() {
		return this.getParametersDao().getUserList(KYCSegConstants.KYCS_USRPROF_SUP);
	}

	public Integer getFechaHoy() {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public List<CategoriaGS> getCategoriasGSList(final Integer categoriaAIS) {
		return this.getJMSCommService().getCategoriasGSList(categoriaAIS);
	}
}
