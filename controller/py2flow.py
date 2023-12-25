from pyflowchart import Flowchart
with open('code.py') as f:
    code = f.read()
fc = Flowchart.from_code(code)
f=open('code.txt','w')
f.write(fc.flowchart())
print(fc.flowchart())