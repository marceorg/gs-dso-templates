/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2012. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hsbc.hbar.bancaseg.service.BSService;
import com.hsbc.hbar.bancaseg.service.MdwService;
import com.hsbc.hbar.bancaseg.service.ParametersService;
import com.hsbc.hbar.bancaseg.service.UserValidationService;
import com.hsbc.hbar.bancaseg.service.UtilCommService;

public class ServiceFactory {
	private static ApplicationContext context = null;

	public static ApplicationContext getContext() {
		if (ServiceFactory.context == null) {
			ServiceFactory.context = new ClassPathXmlApplicationContext(new String[] { "ApplicationContextBS.xml" });
		}
		return ServiceFactory.context;
	}

	public static UserValidationService getUserValidationService() {
		return (UserValidationService) getContext().getBean("UserValidationService");
	}

	public static ParametersService getParametersService() {
		return (ParametersService) getContext().getBean("ParametersService");
	}

	public static BSService getBSService() {
		return (BSService) getContext().getBean("BSService");
	}

	public static MdwService getMdwService() {
		return (MdwService) getContext().getBean("MdwService");
	}

	public static UtilCommService getUtilCommService() {
		return (UtilCommService) getContext().getBean("UtilCommService");
	}
}
