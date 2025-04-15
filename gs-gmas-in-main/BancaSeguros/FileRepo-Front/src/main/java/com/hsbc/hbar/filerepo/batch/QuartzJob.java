/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.batch;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.hsbc.hbar.filerepo.dao.ParametersDao;
import com.hsbc.hbar.filerepo.service.BatchService;
import com.hsbc.hbar.filerepo.service.impl.ServiceFactory;

public class QuartzJob implements Job {
	static Logger logger = LogManager.getLogger(QuartzJob.class);

	private BatchService batchService;
	private ParametersDao parametersDao;

	public BatchService getBatchService() {
		if (this.batchService == null) {
			this.batchService = (BatchService) ServiceFactory.getContext().getBean("BatchService");
		}
		return this.batchService;
	}

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
	}

	@Override
	public void execute(final JobExecutionContext context) throws JobExecutionException {
		QuartzJob.logger.info("--------------------------------");
		QuartzJob.logger.info("FR: Inicio Servicio BatchServlet");
		QuartzJob.logger.info("--------------------------------");
		Boolean res = this.getBatchService().setBatchProcess(this.getParametersDao().getParamGral("INSSVCKEY"));
		QuartzJob.logger.info("Resultado: {}", res);
		QuartzJob.logger.info("--------------------------------");
		QuartzJob.logger.info("FR: Fin Servicio BatchServlet   ");
		QuartzJob.logger.info("--------------------------------");
	}
}