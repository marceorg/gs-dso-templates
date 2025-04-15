/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2012. ALL RIGHTS RESERVED.
 * 
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.service.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hsbc.hbar.publicins.service.PublicadorService;

public class ServiceFactory {

	private static ApplicationContext context = null;

	public static ApplicationContext getContext() {
		if (ServiceFactory.context == null) {
			ServiceFactory.context = new ClassPathXmlApplicationContext(new String[] { "ApplicationContextPU.xml" });
		}
		return ServiceFactory.context;
	}

	public static PublicadorService getPublicadorService() {
		return (PublicadorService) getContext().getBean("PublicadorService");
	}
}
