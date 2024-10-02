#!/usr/bin/env python3

import os
import time
from jinja2 import Template

template_file = '/etc/nginx/nginx.conf.j2'
output_file = '/etc/nginx/nginx.conf'

# Read the template file manually
with open(template_file, 'r') as f:
    template_content = f.read()

# Create a Jinja2 template from the file content
template = Template(template_content)

# Prepare the context with environment variables
context = {
    "SSL_MODE": os.getenv('SSL_MODE', 'OFF'),  # OFF, ON, FORCE
    "WEB_AUTH": os.getenv('WEB_AUTH', 'OFF'),  # OFF, ON
    "WR_ENABLED": bool(os.getenv('WR_ENABLED', 'NO') == 'YES'),  # NO, YES
    "timestamp": time.strftime("%d %b %y %H:%M"),
}

# Render the template with the context
rendered_output = template.render(context)

# Write the rendered output to the output file
with open(output_file, 'w') as f:
    f.write(rendered_output)
