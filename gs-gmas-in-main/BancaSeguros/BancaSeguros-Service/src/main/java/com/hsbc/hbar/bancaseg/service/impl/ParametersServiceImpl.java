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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.hsbc.hbar.bancaseg.dao.ParametersDao;
import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.DenDocReq;
import com.hsbc.hbar.bancaseg.model.common.ParSinEstado;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;
import com.hsbc.hbar.bancaseg.model.common.TipoDoc;
import com.hsbc.hbar.bancaseg.service.JMSCommService;
import com.hsbc.hbar.bancaseg.service.ParametersService;
import com.hsbc.hbar.bancaseg.service.utils.UtilFormat;

public class ParametersServiceImpl implements ParametersService {
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

	public List<Compania> getCompaniaList() {
		return this.getParametersDao().getCompaniaList();
	}

	public List<TipoDoc> getTipoDocList() {
		return this.getParametersDao().getTipoDocList();
	}

	public Integer getFechaHoy() {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public List<Producto> getProductoList(final Integer compania) {
		return this.getJMSCommService().getProductoList(compania);
	}

	public List<Sucursal> getSucursalList(final Integer compania) {
		return this.getJMSCommService().getSucursalList(compania);
	}

	public List<Canal> getCanalList(final Integer compania) {
		return this.getJMSCommService().getCanalList(compania);
	}

	public List<ParSinEstado> getSinEstadoList() {
		return this.getParametersDao().getSinEstadoList();
	}

	public List<Parentesco> getParentescoList() {
		return this.getParametersDao().getParentescoList();
	}

	public List<DenDocReq> getDenDocReqList(final Integer compania, final String producto) {
		return this.getJMSCommService().getDenDocReqList(compania, producto);
	}

	public List<String> getLogExec(final String param) {
		return this.getParametersDao().getLogExec(UtilFormat.getValChars(param));
	}
}
