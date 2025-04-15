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

import java.io.IOException;

import javax.servlet.GenericServlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

import com.hsbc.hbar.filerepo.dao.ParametersDao;
import com.hsbc.hbar.filerepo.service.impl.ServiceFactory;

public class QuartzScheduler extends GenericServlet {
	static Logger logger = LogManager.getLogger(QuartzScheduler.class);
	private static final long serialVersionUID = 1L;

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

	public void init(final ServletConfig config) throws ServletException {

		super.init(config);

		Scheduler sched;
		try {
			sched = StdSchedulerFactory.getDefaultScheduler();
			sched.start();
			// Schedule variable por tabla
			JobDetail job = JobBuilder.newJob(QuartzJob.class).withIdentity("QuartzJob").build();
			String cronExpression = this.getParametersDao().getParamGral("BFRCROSCH");
			CronScheduleBuilder cronSchedule = CronScheduleBuilder.cronSchedule(cronExpression);
			QuartzScheduler.logger.info("Quartz CronExpression: {}", cronExpression);
			Trigger trigger = TriggerBuilder.newTrigger().withIdentity("QuartzTrigger").withSchedule(cronSchedule)
					.startNow().build();

			sched.scheduleJob(job, trigger);

		} catch (SchedulerException e) {
			QuartzScheduler.logger.error(e);
		}
	}

	@Override
	public void service(final ServletRequest arg0, final ServletResponse arg1) throws ServletException, IOException {
		// Este metodo no se usa
	}
}
