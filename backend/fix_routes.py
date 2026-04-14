import os
import glob
import re

routes_files = glob.glob('features/**/*.routes.js', recursive=True)

for path in routes_files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip files that already use { protect } (like org.routes.js)
    if 'const auth =' in content or 'const tenantScope =' in content or 'const rbac =' in content:
        # Fix imports
        content = content.replace("const auth = require('../../middleware/auth');", "const { protect } = require('../../middleware/auth');")
        content = content.replace("const tenantScope = require('../../middleware/tenantScope');", "const { tenantScope } = require('../../middleware/tenantScope');")
        content = content.replace("const rbac = require('../../middleware/rbac');", "const { authorize, checkPermissions } = require('../../middleware/rbac');")
        
        # fix router.use
        content = content.replace("router.use(auth);", "router.use(protect);")
        
        # Fix rbac(...) calls to authorize or checkPermissions
        # Let's replace `rbac.permit(` with `checkPermissions(`
        content = content.replace("rbac.permit(", "checkPermissions(")
        
        # In unit.routes.js, category.routes.js, etc it was rbac('org_admin', 'super_admin') => authorize('org_admin', 'super_admin')
        # In product.routes.js it was rbac('org_admin', 'super_admin', 'products.create')
        # Let's use regex to replace rbac(anything) with authorize(anything) if it doesn't contain '.'
        # If it contains '.', replace with checkPermissions(last string)
        
        def replace_rbac(match):
            args_str = match.group(1)
            # If any arg has a dot (like 'products.create')
            if '.' in args_str:
                # get the strings with dots
                perms = [s.strip(" '\"") for s in args_str.split(',') if '.' in s]
                new_args = ', '.join(f"'{p}'" for p in perms)
                return f"checkPermissions({new_args})"
            else:
                return f"authorize({args_str})"

        content = re.sub(r'rbac\((.*?)\)', replace_rbac, content)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

print('Routes fixed.')
