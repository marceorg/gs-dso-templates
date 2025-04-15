/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2012. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hsbc.hbar.kycseg.service.CPFinderService;
import com.hsbc.hbar.kycseg.service.KYCService;
import com.hsbc.hbar.kycseg.service.MdwService;
import com.hsbc.hbar.kycseg.service.ParametersService;
import com.hsbc.hbar.kycseg.service.UserValidationService;

public class ServiceFactory {

	private static ApplicationContext context = null;

	public static ApplicationContext getContext() {
		if (ServiceFactory.context == null) {
			ServiceFactory.context = new ClassPathXmlApplicationContext(new String[] { "ApplicationContextKS.xml" });
		}
		return ServiceFactory.context;
	}

	public static UserValidationService getUserValidationService() {
		return (UserValidationService) getContext().getBean("UserValidationService");
	}

	public static CPFinderService getCPFinderService() {
		return (CPFinderService) getContext().getBean("CPFinderService");
	}

	public static ParametersService getParametersService() {
		return (ParametersService) getContext().getBean("ParametersService");
	}

	public static KYCService getKYCService() {
		return (KYCService) getContext().getBean("KYCService");
	}

	public static MdwService getMdwService() {
		return (MdwService) getContext().getBean("MdwService");
	}
}
