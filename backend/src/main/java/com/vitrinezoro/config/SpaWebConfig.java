package com.vitrinezoro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;

/** SPA routing + static file serving. */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/")
            .setCachePeriod(3600);

        // Serve static assets (CSS, JS, images)
        registry
            .addResourceHandler("/static/**", "/assets/**", "*.js", "*.css")
            .addResourceLocations("classpath:/static/");

        // SPA routing: fallback to index.html for React Router
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource getResource(String resourcePath, Resource location) throws IOException {
                    Resource resource = location.createRelative(resourcePath);
                    if (resource.exists() && resource.isReadable())
                        return resource;
                    return new ClassPathResource("/static/index.html");
                }
            });
    }
}
